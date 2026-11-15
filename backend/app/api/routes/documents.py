"""Document management API routes for uploading, listing, viewing, searching, and deleting documents."""

import uuid
from typing import Any, Dict, Optional
from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile, status
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.config import get_settings
from backend.app.core.logging import get_logger
from backend.app.db.session import get_db
from backend.app.documents.schemas import (
    DocumentDetailResponse,
    DocumentListResponse,
    DocumentSummary,
    DocumentUploadResponse,
    RetrievalResult,
)
from backend.app.documents.service import DocumentService
from backend.app.services.retrieval import RetrievalService

logger = get_logger(__name__)

router = APIRouter(prefix="/documents", tags=["Documents"])

SUPPORTED_EXTENSIONS = {".pdf", ".txt", ".md", ".markdown"}


class DocumentSearchRequest(BaseModel):
    """Request payload for semantic document search."""

    query: str = Field(..., min_length=1, description="Natural language search query")
    top_k: int = Field(default=5, ge=1, le=50, description="Maximum number of relevant chunks to retrieve")
    workspace_id: Optional[str] = Field(default=None, description="Optional workspace UUID filter")


@router.post(
    "",
    response_model=DocumentUploadResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload and ingest a document",
    description="Uploads a PDF, plain text, or Markdown document, stores in Supabase Storage, extracts text, generates embeddings, and indexes in PostgreSQL pgvector.",
)
async def upload_document(
    file: UploadFile = File(...),
    workspace_id: Optional[str] = Form(None),
    session: AsyncSession = Depends(get_db),
) -> DocumentUploadResponse:
    """Upload and process a document file into the vector knowledge base."""
    filename = file.filename or "uploaded_document"
    settings = get_settings()

    # 1. Validate file extension
    ext = "." + filename.split(".")[-1].lower() if "." in filename else ""
    if ext not in SUPPORTED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '{ext}'. Supported formats are: {', '.join(sorted(SUPPORTED_EXTENSIONS))}",
        )

    # 2. Read file content
    try:
        content = await file.read()
    except Exception as read_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to read uploaded file: {str(read_err)}",
        )

    if not content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty (0 bytes).",
        )

    # 3. Check file size
    max_bytes = settings.MAX_DOCUMENT_SIZE_MB * 1024 * 1024
    if len(content) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds maximum allowed size of {settings.MAX_DOCUMENT_SIZE_MB}MB.",
        )

    # Resolve workspace UUID
    ws_uuid = None
    if workspace_id:
        try:
            ws_uuid = uuid.UUID(workspace_id)
        except ValueError:
            pass

    # 4. Ingest document via DocumentService
    try:
        doc = await DocumentService.ingest_document(
            db=session,
            file_bytes=content,
            original_filename=filename,
            content_type=file.content_type or "application/octet-stream",
            workspace_id=ws_uuid,
        )
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err),
        )
    except Exception as exc:
        logger.error(f"Error during document ingestion: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Document ingestion failed: {str(exc)}",
        )

    return DocumentUploadResponse(
        document_id=doc.id,
        filename=doc.original_filename,
        status=doc.status,
        page_count=doc.page_count,
        chunk_count=doc.chunk_count,
        workspace_id=doc.workspace_id,
        storage_path=doc.storage_path,
    )


@router.get(
    "",
    response_model=DocumentListResponse,
    status_code=status.HTTP_200_OK,
    summary="List ingested documents",
    description="Returns a paginated list of documents with metadata, page counts, storage paths, and indexing status.",
)
async def list_documents(
    workspace_id: Optional[str] = Query(default=None, description="Filter documents by workspace UUID"),
    page: int = Query(default=1, ge=1, description="Page number"),
    page_size: int = Query(default=20, ge=1, le=100, description="Items per page"),
    session: AsyncSession = Depends(get_db),
) -> DocumentListResponse:
    """Retrieve paginated list of documents."""
    ws_uuid = None
    if workspace_id:
        try:
            ws_uuid = uuid.UUID(workspace_id)
        except ValueError:
            pass

    items, total = await DocumentService.list_documents(
        db=session,
        workspace_id=ws_uuid,
        page=page,
        page_size=page_size,
    )

    summaries = [
        DocumentSummary(
            document_id=doc.id,
            filename=doc.filename,
            original_filename=doc.original_filename,
            content_type=doc.content_type,
            file_size=doc.file_size,
            status=doc.status,
            page_count=doc.page_count,
            chunk_count=doc.chunk_count,
            checksum=doc.checksum,
            created_at=doc.created_at,
            workspace_id=doc.workspace_id,
            storage_path=doc.storage_path,
        )
        for doc in items
    ]

    return DocumentListResponse(
        items=summaries,
        page=page,
        page_size=page_size,
        total=total,
    )


@router.post(
    "/search",
    response_model=RetrievalResult,
    status_code=status.HTTP_200_OK,
    summary="Semantic document search",
    description="Searches the PostgreSQL pgvector knowledge base using cosine distance and returns ranked chunks with page citations.",
)
async def search_documents_endpoint(
    request: DocumentSearchRequest,
    session: AsyncSession = Depends(get_db),
) -> RetrievalResult:
    """Execute semantic query retrieval against the pgvector indexed knowledge base."""
    ws_uuid = None
    if request.workspace_id:
        try:
            ws_uuid = uuid.UUID(request.workspace_id)
        except ValueError:
            pass

    return await RetrievalService.retrieve_pgvector(
        db=session,
        query=request.query,
        top_k=request.top_k,
        workspace_id=ws_uuid,
    )


@router.get(
    "/{document_id}",
    response_model=DocumentDetailResponse,
    status_code=status.HTTP_200_OK,
    summary="Get document details",
    description="Returns detailed metadata and chunk summary for a specific document.",
)
async def get_document(
    document_id: str,
    session: AsyncSession = Depends(get_db),
) -> DocumentDetailResponse:
    """Retrieve full document details by ID."""
    try:
        doc_uuid = uuid.UUID(document_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid document UUID format: '{document_id}'",
        )

    doc = await DocumentService.get_document(db=session, document_id=doc_uuid)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document '{document_id}' not found.",
        )

    return DocumentDetailResponse(
        document_id=doc.id,
        filename=doc.filename,
        original_filename=doc.original_filename,
        content_type=doc.content_type,
        file_size=doc.file_size,
        checksum=doc.checksum,
        status=doc.status,
        page_count=doc.page_count,
        chunk_count=doc.chunk_count,
        error_message=doc.error_message,
        metadata=doc.metadata_json or {},
        workspace_id=doc.workspace_id,
        storage_path=doc.storage_path,
        created_at=doc.created_at,
        updated_at=doc.updated_at,
    )


@router.delete(
    "/{document_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete a document",
    description="Deletes a document from the database, removes storage file from Supabase Storage, and cascades deletion to chunks and pgvector vectors.",
)
async def delete_document(
    document_id: str,
    session: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    """Delete a document, purge vectors from pgvector and FAISS, and delete from Supabase Storage."""
    try:
        doc_uuid = uuid.UUID(document_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid document UUID format: '{document_id}'",
        )

    deleted = await DocumentService.delete_document(db=session, document_id=doc_uuid)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document '{document_id}' not found.",
        )

    return {"status": "deleted", "document_id": str(document_id)}
