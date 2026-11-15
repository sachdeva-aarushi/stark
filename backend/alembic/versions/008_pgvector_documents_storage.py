"""Add workspace_id, storage_path, and pgvector embeddings to documents and document_chunks.

Revision ID: 008_pgvector_documents_storage
Revises: 007_workspaces_agents_workflows
Create Date: 2026-11-15 19:35:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from pgvector.sqlalchemy import Vector

# revision identifiers, used by Alembic.
revision = '008_pgvector_documents_storage'
down_revision = '007_workspaces_agents_workflows'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Ensure vector extension is enabled
    op.execute('CREATE EXTENSION IF NOT EXISTS vector;')

    # Add columns to documents
    op.add_column('documents', sa.Column('workspace_id', postgresql.UUID(as_uuid=True), nullable=True))
    op.add_column('documents', sa.Column('storage_path', sa.String(length=512), nullable=True))
    op.create_index(op.f('ix_documents_workspace_id'), 'documents', ['workspace_id'], unique=False)
    op.create_foreign_key('fk_documents_workspace_id_workspaces', 'documents', 'workspaces', ['workspace_id'], ['id'], ondelete='CASCADE')

    # Add columns to document_chunks
    op.add_column('document_chunks', sa.Column('embedding', Vector(384), nullable=True))
    op.add_column('document_chunks', sa.Column('embedding_model', sa.String(length=128), nullable=True))
    op.add_column('document_chunks', sa.Column('embedding_dimension', sa.Integer(), nullable=True))


def downgrade() -> None:
    # Drop columns from document_chunks
    op.drop_column('document_chunks', 'embedding_dimension')
    op.drop_column('document_chunks', 'embedding_model')
    op.drop_column('document_chunks', 'embedding')

    # Drop columns from documents
    op.drop_constraint('fk_documents_workspace_id_workspaces', 'documents', type_='foreignkey')
    op.drop_index(op.f('ix_documents_workspace_id'), table_name='documents')
    op.drop_column('documents', 'storage_path')
    op.drop_column('documents', 'workspace_id')
