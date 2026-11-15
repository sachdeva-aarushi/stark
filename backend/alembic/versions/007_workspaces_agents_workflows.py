"""Add workspaces, agent_definitions, and workflow_definitions tables.

Revision ID: 007_workspaces_agents_workflows
Revises: 006_evaluation_engine
Create Date: 2026-11-15 12:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '007_workspaces_agents_workflows'
down_revision: Union[str, None] = '006_evaluation_engine'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Create workspaces table
    op.create_table(
        'workspaces',
        sa.Column('id', sa.UUID(), primary_key=True),
        sa.Column('name', sa.String(length=128), nullable=False),
        sa.Column('slug', sa.String(length=128), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index(op.f('ix_workspaces_slug'), 'workspaces', ['slug'], unique=True)
    op.create_index(op.f('ix_workspaces_created_at'), 'workspaces', ['created_at'], unique=False)

    # 2. Create agent_definitions table
    op.create_table(
        'agent_definitions',
        sa.Column('id', sa.UUID(), primary_key=True),
        sa.Column('workspace_id', sa.UUID(), sa.ForeignKey('workspaces.id', ondelete='CASCADE'), nullable=False),
        sa.Column('name', sa.String(length=128), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('agent_type', sa.String(length=64), nullable=False),
        sa.Column('system_instructions', sa.Text(), nullable=True),
        sa.Column('model_config_json', postgresql.JSONB(astext_type=sa.Text()), server_default='{}', nullable=False),
        sa.Column('tools', postgresql.JSONB(astext_type=sa.Text()), server_default='[]', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index(op.f('ix_agent_definitions_workspace_id'), 'agent_definitions', ['workspace_id'], unique=False)
    op.create_index(op.f('ix_agent_definitions_name'), 'agent_definitions', ['name'], unique=False)
    op.create_index(op.f('ix_agent_definitions_agent_type'), 'agent_definitions', ['agent_type'], unique=False)
    op.create_index(op.f('ix_agent_definitions_created_at'), 'agent_definitions', ['created_at'], unique=False)

    # 3. Create workflow_definitions table
    op.create_table(
        'workflow_definitions',
        sa.Column('id', sa.UUID(), primary_key=True),
        sa.Column('workspace_id', sa.UUID(), sa.ForeignKey('workspaces.id', ondelete='CASCADE'), nullable=False),
        sa.Column('name', sa.String(length=128), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('objective', sa.Text(), nullable=True),
        sa.Column('agent_sequence', postgresql.JSONB(astext_type=sa.Text()), server_default='[]', nullable=False),
        sa.Column('approval_required', sa.Boolean(), server_default=sa.text('true'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index(op.f('ix_workflow_definitions_workspace_id'), 'workflow_definitions', ['workspace_id'], unique=False)
    op.create_index(op.f('ix_workflow_definitions_name'), 'workflow_definitions', ['name'], unique=False)
    op.create_index(op.f('ix_workflow_definitions_created_at'), 'workflow_definitions', ['created_at'], unique=False)


def downgrade() -> None:
    op.drop_table('workflow_definitions')
    op.drop_table('agent_definitions')
    op.drop_table('workspaces')
