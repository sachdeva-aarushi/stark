"""Workspaces, Agent Definitions, and Workflow Definitions API routes."""

import uuid
from typing import Any, Dict, List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from backend.app.core.logging import get_logger
from backend.app.db.models.agent_definition import AgentDefinition
from backend.app.db.models.workflow_definition import WorkflowDefinition
from backend.app.db.models.workspace import Workspace
from backend.app.db.session import get_db

logger = get_logger(__name__)

router = APIRouter(prefix="/workspaces", tags=["Workspaces"])


# ==============================================================================
# Schemas
# ==============================================================================

class WorkspaceSummary(BaseModel):
    id: str
    name: str
    slug: str
    description: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    agents_count: int = 0
    workflows_count: int = 0


class WorkspaceDetailResponse(BaseModel):
    id: str
    name: str
    slug: str
    description: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    agents_count: int = 0
    workflows_count: int = 0


class WorkspaceListResponse(BaseModel):
    items: List[WorkspaceSummary]
    total: int


class AgentDefinitionCreate(BaseModel):
    name: str = Field(..., max_length=128)
    description: Optional[str] = None
    agent_type: str = Field(..., max_length=64)
    system_instructions: Optional[str] = None
    model_config_json: Dict[str, Any] = Field(default_factory=dict, alias="model_config")
    tools: List[str] = Field(default_factory=list)

    model_config = {"populate_by_name": True}


class AgentDefinitionResponse(BaseModel):
    id: str
    workspace_id: str
    name: str
    description: Optional[str] = None
    agent_type: str
    system_instructions: Optional[str] = None
    model_config: Dict[str, Any] = Field(alias="model_config_json")
    tools: List[Any]
    created_at: datetime
    updated_at: datetime

    model_config = {"populate_by_name": True}


class AgentDefinitionListResponse(BaseModel):
    items: List[AgentDefinitionResponse]
    total: int


class WorkflowDefinitionCreate(BaseModel):
    name: str = Field(..., max_length=128)
    description: Optional[str] = None
    objective: Optional[str] = None
    agent_sequence: List[str] = Field(default_factory=list)
    approval_required: bool = True


class WorkflowDefinitionResponse(BaseModel):
    id: str
    workspace_id: str
    name: str
    description: Optional[str] = None
    objective: Optional[str] = None
    agent_sequence: List[str]
    approval_required: bool
    created_at: datetime
    updated_at: datetime


class WorkflowDefinitionListResponse(BaseModel):
    items: List[WorkflowDefinitionResponse]
    total: int


# ==============================================================================
# Workspace Endpoints
# ==============================================================================

@router.get(
    "",
    response_model=WorkspaceListResponse,
    status_code=status.HTTP_200_OK,
    summary="List workspaces",
    description="Returns all workspaces with agent and workflow counts.",
)
async def list_workspaces_endpoint(
    session: AsyncSession = Depends(get_db),
) -> WorkspaceListResponse:
    """Retrieve all available workspaces."""
    stmt = select(Workspace).options(
        selectinload(Workspace.agents),
        selectinload(Workspace.workflows),
    ).order_by(Workspace.created_at.asc())

    res = await session.execute(stmt)
    records = list(res.scalars().all())

    items = [
        WorkspaceSummary(
            id=str(w.id),
            name=w.name,
            slug=w.slug,
            description=w.description,
            created_at=w.created_at,
            updated_at=w.updated_at,
            agents_count=len(w.agents),
            workflows_count=len(w.workflows),
        )
        for w in records
    ]

    return WorkspaceListResponse(items=items, total=len(items))


@router.get(
    "/current",
    response_model=WorkspaceDetailResponse,
    status_code=status.HTTP_200_OK,
    summary="Get current/demo workspace",
    description="Returns the active STARK demo workspace.",
)
async def get_current_workspace_endpoint(
    session: AsyncSession = Depends(get_db),
) -> WorkspaceDetailResponse:
    """Retrieve the primary demo workspace."""
    stmt = (
        select(Workspace)
        .where(Workspace.slug == "stark-demo")
        .options(
            selectinload(Workspace.agents),
            selectinload(Workspace.workflows),
        )
    )
    res = await session.execute(stmt)
    workspace = res.scalar_one_or_none()

    if not workspace:
        # Fallback to the first available workspace
        fallback_stmt = select(Workspace).options(
            selectinload(Workspace.agents),
            selectinload(Workspace.workflows),
        ).limit(1)
        fallback_res = await session.execute(fallback_stmt)
        workspace = fallback_res.scalar_one_or_none()

    if not workspace:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No workspace found. Please run the seed script to create the demo workspace.",
        )

    return WorkspaceDetailResponse(
        id=str(workspace.id),
        name=workspace.name,
        slug=workspace.slug,
        description=workspace.description,
        created_at=workspace.created_at,
        updated_at=workspace.updated_at,
        agents_count=len(workspace.agents),
        workflows_count=len(workspace.workflows),
    )


@router.get(
    "/{workspace_id}",
    response_model=WorkspaceDetailResponse,
    status_code=status.HTTP_200_OK,
    summary="Get workspace details by ID",
)
async def get_workspace_endpoint(
    workspace_id: str,
    session: AsyncSession = Depends(get_db),
) -> WorkspaceDetailResponse:
    """Retrieve a single workspace by UUID or slug."""
    try:
        ws_uuid = uuid.UUID(workspace_id)
        stmt = select(Workspace).where(Workspace.id == ws_uuid)
    except ValueError:
        stmt = select(Workspace).where(Workspace.slug == workspace_id)

    stmt = stmt.options(
        selectinload(Workspace.agents),
        selectinload(Workspace.workflows),
    )
    res = await session.execute(stmt)
    workspace = res.scalar_one_or_none()

    if not workspace:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Workspace '{workspace_id}' not found.",
        )

    return WorkspaceDetailResponse(
        id=str(workspace.id),
        name=workspace.name,
        slug=workspace.slug,
        description=workspace.description,
        created_at=workspace.created_at,
        updated_at=workspace.updated_at,
        agents_count=len(workspace.agents),
        workflows_count=len(workspace.workflows),
    )


# ==============================================================================
# Agent Definitions Endpoints
# ==============================================================================

@router.get(
    "/{workspace_id}/agents",
    response_model=AgentDefinitionListResponse,
    status_code=status.HTTP_200_OK,
    summary="List agent definitions for workspace",
)
async def list_agents_for_workspace_endpoint(
    workspace_id: str,
    session: AsyncSession = Depends(get_db),
) -> AgentDefinitionListResponse:
    """List all agents configured within a workspace."""
    try:
        ws_uuid = uuid.UUID(workspace_id)
    except ValueError:
        # Resolve slug
        ws_res = await session.execute(select(Workspace.id).where(Workspace.slug == workspace_id))
        ws_uuid = ws_res.scalar_one_or_none()
        if not ws_uuid:
            raise HTTPException(status_code=404, detail=f"Workspace '{workspace_id}' not found.")

    stmt = select(AgentDefinition).where(AgentDefinition.workspace_id == ws_uuid).order_by(AgentDefinition.created_at.asc())
    res = await session.execute(stmt)
    records = list(res.scalars().all())

    items = [
        AgentDefinitionResponse(
            id=str(a.id),
            workspace_id=str(a.workspace_id),
            name=a.name,
            description=a.description,
            agent_type=a.agent_type,
            system_instructions=a.system_instructions,
            model_config_json=a.model_config_json or {},
            tools=a.tools or [],
            created_at=a.created_at,
            updated_at=a.updated_at,
        )
        for a in records
    ]

    return AgentDefinitionListResponse(items=items, total=len(items))


@router.post(
    "/{workspace_id}/agents",
    response_model=AgentDefinitionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create agent definition in workspace",
)
async def create_agent_endpoint(
    workspace_id: str,
    payload: AgentDefinitionCreate,
    session: AsyncSession = Depends(get_db),
) -> AgentDefinitionResponse:
    """Create a new agent definition."""
    try:
        ws_uuid = uuid.UUID(workspace_id)
    except ValueError:
        ws_res = await session.execute(select(Workspace.id).where(Workspace.slug == workspace_id))
        ws_uuid = ws_res.scalar_one_or_none()
        if not ws_uuid:
            raise HTTPException(status_code=404, detail=f"Workspace '{workspace_id}' not found.")

    agent = AgentDefinition(
        id=uuid.uuid4(),
        workspace_id=ws_uuid,
        name=payload.name,
        description=payload.description,
        agent_type=payload.agent_type,
        system_instructions=payload.system_instructions,
        model_config_json=payload.model_config_json,
        tools=payload.tools,
    )
    session.add(agent)
    await session.commit()
    await session.refresh(agent)

    return AgentDefinitionResponse(
        id=str(agent.id),
        workspace_id=str(agent.workspace_id),
        name=agent.name,
        description=agent.description,
        agent_type=agent.agent_type,
        system_instructions=agent.system_instructions,
        model_config_json=agent.model_config_json or {},
        tools=agent.tools or [],
        created_at=agent.created_at,
        updated_at=agent.updated_at,
    )


# ==============================================================================
# Workflow Definitions Endpoints
# ==============================================================================

@router.get(
    "/{workspace_id}/workflows",
    response_model=WorkflowDefinitionListResponse,
    status_code=status.HTTP_200_OK,
    summary="List workflow definitions for workspace",
)
async def list_workflows_for_workspace_endpoint(
    workspace_id: str,
    session: AsyncSession = Depends(get_db),
) -> WorkflowDefinitionListResponse:
    """List all workflows defined within a workspace."""
    try:
        ws_uuid = uuid.UUID(workspace_id)
    except ValueError:
        ws_res = await session.execute(select(Workspace.id).where(Workspace.slug == workspace_id))
        ws_uuid = ws_res.scalar_one_or_none()
        if not ws_uuid:
            raise HTTPException(status_code=404, detail=f"Workspace '{workspace_id}' not found.")

    stmt = select(WorkflowDefinition).where(WorkflowDefinition.workspace_id == ws_uuid).order_by(WorkflowDefinition.created_at.asc())
    res = await session.execute(stmt)
    records = list(res.scalars().all())

    items = [
        WorkflowDefinitionResponse(
            id=str(w.id),
            workspace_id=str(w.workspace_id),
            name=w.name,
            description=w.description,
            objective=w.objective,
            agent_sequence=w.agent_sequence or [],
            approval_required=w.approval_required,
            created_at=w.created_at,
            updated_at=w.updated_at,
        )
        for w in records
    ]

    return WorkflowDefinitionListResponse(items=items, total=len(items))


@router.post(
    "/{workspace_id}/workflows",
    response_model=WorkflowDefinitionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create workflow definition in workspace",
)
async def create_workflow_endpoint(
    workspace_id: str,
    payload: WorkflowDefinitionCreate,
    session: AsyncSession = Depends(get_db),
) -> WorkflowDefinitionResponse:
    """Create a new workflow definition."""
    try:
        ws_uuid = uuid.UUID(workspace_id)
    except ValueError:
        ws_res = await session.execute(select(Workspace.id).where(Workspace.slug == workspace_id))
        ws_uuid = ws_res.scalar_one_or_none()
        if not ws_uuid:
            raise HTTPException(status_code=404, detail=f"Workspace '{workspace_id}' not found.")

    wf = WorkflowDefinition(
        id=uuid.uuid4(),
        workspace_id=ws_uuid,
        name=payload.name,
        description=payload.description,
        objective=payload.objective,
        agent_sequence=payload.agent_sequence,
        approval_required=payload.approval_required,
    )
    session.add(wf)
    await session.commit()
    await session.refresh(wf)

    return WorkflowDefinitionResponse(
        id=str(wf.id),
        workspace_id=str(wf.workspace_id),
        name=wf.name,
        description=wf.description,
        objective=wf.objective,
        agent_sequence=wf.agent_sequence or [],
        approval_required=wf.approval_required,
        created_at=wf.created_at,
        updated_at=wf.updated_at,
    )


# ==============================================================================
# Workspace Documents & RAG Endpoints
# ==============================================================================

@router.get(
    "/{workspace_id}/documents",
    status_code=status.HTTP_200_OK,
    summary="List documents in workspace",
)
async def list_workspace_documents(
    workspace_id: str,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=50, ge=1, le=100),
    session: AsyncSession = Depends(get_db),
):
    """Retrieve documents associated with a workspace."""
    from backend.app.documents.service import DocumentService
    try:
        ws_uuid = uuid.UUID(workspace_id)
    except ValueError:
        ws_res = await session.execute(select(Workspace.id).where(Workspace.slug == workspace_id))
        ws_uuid = ws_res.scalar_one_or_none()

    items, total = await DocumentService.list_documents(
        db=session,
        workspace_id=ws_uuid,
        page=page,
        page_size=page_size,
    )

    return {
        "items": [
            {
                "id": str(doc.id),
                "document_id": str(doc.id),
                "filename": doc.filename,
                "original_filename": doc.original_filename,
                "file_size_bytes": doc.file_size,
                "file_size": doc.file_size,
                "status": doc.status,
                "page_count": doc.page_count,
                "chunk_count": doc.chunk_count,
                "workspace_id": str(doc.workspace_id) if doc.workspace_id else str(ws_uuid),
                "created_at": doc.created_at.isoformat() if doc.created_at else "",
                "storage_path": doc.storage_path,
            }
            for doc in items
        ],
        "total": total,
    }


@router.post(
    "/{workspace_id}/documents",
    status_code=status.HTTP_201_CREATED,
    summary="Upload document to workspace",
)
async def upload_workspace_document(
    workspace_id: str,
    file: Any = None,
    session: AsyncSession = Depends(get_db),
):
    """Upload document directly into workspace."""
    from fastapi import UploadFile, File
    from backend.app.documents.service import DocumentService
    # Forward to document service
    return {"message": "Use /api/v1/documents for multipart upload"}


class WorkspaceRAGQueryRequest(BaseModel):
    query: str
    top_k: int = 5


@router.post(
    "/{workspace_id}/rag/search",
    status_code=status.HTTP_200_OK,
    summary="Semantic search in workspace",
)
async def search_workspace_rag(
    workspace_id: str,
    payload: WorkspaceRAGQueryRequest,
    session: AsyncSession = Depends(get_db),
):
    """Semantic vector search inside workspace corpus using pgvector."""
    from backend.app.services.retrieval import RetrievalService
    try:
        ws_uuid = uuid.UUID(workspace_id)
    except ValueError:
        ws_res = await session.execute(select(Workspace.id).where(Workspace.slug == workspace_id))
        ws_uuid = ws_res.scalar_one_or_none()

    res = await RetrievalService.retrieve_pgvector(
        db=session,
        query=payload.query,
        top_k=payload.top_k,
        workspace_id=ws_uuid,
    )

    return {
        "query": res.query,
        "results": [c.model_dump() for c in res.results],
    }

