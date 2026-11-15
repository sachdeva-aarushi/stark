"""SQLAlchemy Declarative Base and JSON type definition."""

from typing import TYPE_CHECKING
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.types import JSON

# JSONB on PostgreSQL; JSON on other dialects (such as SQLite for fast isolated tests)
JSON_TYPE = JSON().with_variant(JSONB, "postgresql")


class Base(DeclarativeBase):
    """Base class for all SQLAlchemy database models."""
    pass


# Export MVP entities as required
from backend.app.db.models.workspace import Workspace  # noqa: E402
from backend.app.db.models.agent_definition import AgentDefinition  # noqa: E402
from backend.app.db.models.workflow_definition import WorkflowDefinition  # noqa: E402

__all__ = [
    "Base",
    "JSON_TYPE",
    "Workspace",
    "AgentDefinition",
    "WorkflowDefinition",
]
