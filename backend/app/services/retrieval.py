"""Retrieval service bridging semantic query embedding and PostgreSQL pgvector / FAISS."""

import time
import uuid
from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.config import get_settings
from backend.app.core.logging import get_logger
from backend.app.db.models.document import Document
from backend.app.db.models.document_chunk import DocumentChunk
from backend.app.documents.embeddings.provider import get_embedding_provider
from backend.app.documents.schemas import RetrievalResult, RetrievedChunk
from backend.app.documents.vectorstore.faiss_store import get_vector_store

logger = get_logger(__name__)


class RetrievalService:
    """Performs semantic search against indexed document chunks using pgvector and FAISS fallback."""

    @classmethod
    async def retrieve_pgvector(
        cls,
        db: AsyncSession,
        query: str,
        top_k: Optional[int] = None,
        workspace_id: Optional[uuid.UUID] = None,
    ) -> RetrievalResult:
        """Search PostgreSQL pgvector for chunks semantically matching the query.

        Args:
            db: AsyncSession connected to PostgreSQL database.
            query: Natural language query string.
            top_k: Number of relevant chunks to retrieve.
            workspace_id: Optional workspace UUID filter.

        Returns:
            RetrievalResult containing ranked list of RetrievedChunk objects with page citations.
        """
        start_time = time.perf_counter()
        settings = get_settings()
        k = top_k if top_k is not None else settings.TOP_K_RETRIEVAL

        clean_query = (query or "").strip()
        if not clean_query:
            return RetrievalResult(query="", results=[])

        embedding_provider = get_embedding_provider()
        query_vector = embedding_provider.embed_query(clean_query)

        # pgvector cosine distance query
        stmt = (
            select(
                DocumentChunk,
                DocumentChunk.embedding.cosine_distance(query_vector).label("distance"),
                Document.original_filename.label("original_filename"),
            )
            .join(Document, Document.id == DocumentChunk.document_id)
            .where(
                Document.status == "COMPLETED",
                DocumentChunk.embedding.isnot(None),
            )
        )

        if workspace_id:
            stmt = stmt.where(Document.workspace_id == workspace_id)

        stmt = stmt.order_by("distance").limit(k)
        res = await db.execute(stmt)
        rows = res.all()

        retrieved_chunks: List[RetrievedChunk] = []
        for chunk, distance, original_filename in rows:
            dist_val = float(distance) if distance is not None else 1.0
            similarity_score = round(max(0.0, 1.0 - dist_val), 4)

            retrieved_chunks.append(
                RetrievedChunk(
                    chunk_id=str(chunk.id),
                    document_id=str(chunk.document_id),
                    filename=original_filename,
                    content=chunk.content,
                    page_number=chunk.page_number,
                    similarity_score=similarity_score,
                    metadata={
                        **(chunk.metadata_json or {}),
                        "page_number": chunk.page_number,
                        "embedding_model": chunk.embedding_model,
                        "start_char": chunk.start_char,
                        "end_char": chunk.end_char,
                    },
                )
            )

        # If pgvector returned 0 chunks (e.g. index newly mounted), check FAISS fallback
        if not retrieved_chunks:
            logger.info("pgvector returned 0 results; falling back to in-memory FAISS store.")
            faiss_res = cls.retrieve(clean_query, top_k=k)
            if faiss_res.results:
                return faiss_res

        duration_ms = int((time.perf_counter() - start_time) * 1000)
        logger.info(
            f"pgvector retrieval complete for query '{clean_query[:50]}...': "
            f"{len(retrieved_chunks)} chunks retrieved in {duration_ms}ms (top_k={k})."
        )

        return RetrievalResult(query=clean_query, results=retrieved_chunks)

    @staticmethod
    def retrieve(
        query: str,
        top_k: Optional[int] = None,
    ) -> RetrievalResult:
        """Search FAISS vector store for chunks matching the query string.

        Args:
            query: Natural language search string.
            top_k: Number of relevant chunks to retrieve.

        Returns:
            RetrievalResult containing ranked list of RetrievedChunk objects.
        """
        start_time = time.perf_counter()
        settings = get_settings()
        k = top_k if top_k is not None else settings.TOP_K_RETRIEVAL

        clean_query = (query or "").strip()
        if not clean_query:
            return RetrievalResult(query="", results=[])

        vector_store = get_vector_store()
        if vector_store.total_vectors == 0:
            logger.info("Vector index is empty. Returning 0 retrieved chunks.")
            return RetrievalResult(query=clean_query, results=[])

        # 1. Generate query embedding
        embedding_provider = get_embedding_provider()
        query_vector = embedding_provider.embed_query(clean_query)

        # 2. Search FAISS index
        raw_results = vector_store.search(query_vector, top_k=k)

        # 3. Construct strongly typed RetrievedChunk instances
        retrieved_chunks: List[RetrievedChunk] = []
        for chunk_id, score, meta in raw_results:
            retrieved_chunks.append(
                RetrievedChunk(
                    chunk_id=chunk_id,
                    document_id=str(meta.get("document_id", "")),
                    filename=str(meta.get("filename", "")),
                    content=str(meta.get("content", "")),
                    page_number=int(meta.get("page_number", 1)),
                    similarity_score=round(float(score), 4),
                    metadata=dict(meta),
                )
            )

        duration_ms = int((time.perf_counter() - start_time) * 1000)
        logger.info(
            f"Retrieval complete for query '{clean_query[:50]}...': "
            f"{len(retrieved_chunks)} chunks retrieved in {duration_ms}ms (top_k={k})."
        )

        return RetrievalResult(query=clean_query, results=retrieved_chunks)
