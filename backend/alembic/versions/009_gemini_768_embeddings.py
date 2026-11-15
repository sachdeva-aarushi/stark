"""Resize pgvector embeddings column from 384 to 768 dimensions for Google Gemini Embedding.

Revision ID: 009_gemini_768_embeddings
Revises: 008_pgvector_documents_storage
Create Date: 2026-11-16 02:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from pgvector.sqlalchemy import Vector

revision = '009_gemini_768_embeddings'
down_revision = '008_pgvector_documents_storage'
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    if bind.dialect.name == "postgresql":
        op.execute("ALTER TABLE document_chunks ALTER COLUMN embedding TYPE vector(768) USING NULL;")
    else:
        pass


def downgrade() -> None:
    bind = op.get_bind()
    if bind.dialect.name == "postgresql":
        op.execute("ALTER TABLE document_chunks ALTER COLUMN embedding TYPE vector(384) USING NULL;")
    else:
        pass
