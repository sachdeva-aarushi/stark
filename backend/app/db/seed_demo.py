"""Idempotent seed script for STARK demo application.

Seeds:
- Default Workspace ('STARK Demo Workspace' with slug 'stark-demo')
- Default Agent Definitions (Planner, Retrieval, Analysis, Researcher, Responder, Validation)
- Default Workflow Definition ('Enterprise Due Diligence & Analysis Workflow')

Guarantees:
- Fully idempotent: can be executed repeatedly without duplicating records.
"""

import asyncio
import uuid
from typing import Any, Dict, List
from sqlalchemy import select

from backend.app.core.logging import get_logger, setup_logging
from backend.app.db.models.agent_definition import AgentDefinition
from backend.app.db.models.workflow_definition import WorkflowDefinition
from backend.app.db.models.workspace import Workspace
from backend.app.db.session import get_db_context
from backend.app.services.database import close_database_connection

logger = get_logger(__name__)

DEMO_WORKSPACE_SLUG = "stark-demo"
DEMO_WORKSPACE_NAME = "STARK Demo Workspace"
DEMO_WORKSPACE_DESC = "Default enterprise AI workflow workspace for demonstration, document RAG, and multi-agent orchestration."

DEFAULT_AGENTS = [
    {
        "name": "Strategic Planner",
        "agent_type": "planner",
        "description": "Deconstructs business and technical queries into a targeted goal and sequential, actionable execution steps.",
        "system_instructions": "You are an expert Strategic Planner Agent. Deconstruct complex business and technical queries into a coherent high-level goal and 3 to 6 chronological actionable steps.",
        "model_config_json": {"provider": "openai", "model": "gpt-4o-mini", "temperature": 0.2},
        "tools": [],
    },
    {
        "name": "Document Retriever",
        "agent_type": "retrieval",
        "description": "Performs semantic vector similarity search across ingested enterprise documents and knowledge bases.",
        "system_instructions": "Retrieve semantically relevant document chunks from the vector knowledge base based on user query and plan goals.",
        "model_config_json": {"provider": "openai", "model": "gpt-4o-mini", "temperature": 0.1},
        "tools": ["vector_search"],
    },
    {
        "name": "Financial & Data Analyst",
        "agent_type": "data_analysis",
        "description": "Executes structured quantitative analysis and aggregations via approved MCP tools with zero numerical hallucination.",
        "system_instructions": "Determine whether structured data analysis is required, and formulate structured MCP tool calls against approved datasets.",
        "model_config_json": {"provider": "openai", "model": "gpt-4o-mini", "temperature": 0.0},
        "tools": ["analyze_dataset", "get_dataset_schema", "query_postgres"],
    },
    {
        "name": "Research Reasoning Specialist",
        "agent_type": "researcher",
        "description": "Reasons over planned steps, retrieved evidence, and quantitative metrics to produce grounded findings and explicit assumptions.",
        "system_instructions": "Analyze query and plan steps using retrieved context and quantitative metrics. Produce detailed findings and highlight open questions.",
        "model_config_json": {"provider": "openai", "model": "gpt-4o-mini", "temperature": 0.3},
        "tools": [],
    },
    {
        "name": "Executive Responder",
        "agent_type": "responder",
        "description": "Synthesizes all agent outputs into an executive report with key takeaways, source citations, and calibrated confidence.",
        "system_instructions": "Synthesize all research findings, plans, and citations into an articulate, structured executive response with key points and confidence score.",
        "model_config_json": {"provider": "openai", "model": "gpt-4o-mini", "temperature": 0.3},
        "tools": [],
    },
    {
        "name": "Guardrail Validator",
        "agent_type": "validation",
        "description": "Enforces deterministic schema verification, citation provenance, numerical consistency, and hallucination checks.",
        "system_instructions": "Verify output schema compliance, link all citations to verified source documents, and validate computational metrics.",
        "model_config_json": {"provider": "mock", "model": "deterministic-validator", "temperature": 0.0},
        "tools": ["response_schema", "citation_provenance", "numerical_reconciliation", "claim_verification"],
    },
]

DEFAULT_WORKFLOW = {
    "name": "Enterprise Due Diligence & Analysis Workflow",
    "description": "Standard 7-stage enterprise orchestration pipeline integrating document retrieval, quantitative analysis, guardrail validation, and human review.",
    "objective": "Process technical or financial queries through structured planning, semantic document grounding, data analysis, research synthesis, guardrails, and human approval.",
    "agent_sequence": ["planner", "document_retrieval", "data_analysis", "researcher", "responder", "validation"],
    "approval_required": True,
}


async def seed_demo_data() -> Dict[str, Any]:
    """Seed the database with initial demo workspace, agents, and workflow definition."""
    setup_logging("INFO")
    logger.info("Starting STARK demo data seeding...")

    async with get_db_context() as session:
        # 1. Upsert Demo Workspace
        stmt = select(Workspace).where(Workspace.slug == DEMO_WORKSPACE_SLUG)
        res = await session.execute(stmt)
        workspace = res.scalar_one_or_none()

        if not workspace:
            workspace = Workspace(
                id=uuid.uuid4(),
                name=DEMO_WORKSPACE_NAME,
                slug=DEMO_WORKSPACE_SLUG,
                description=DEMO_WORKSPACE_DESC,
            )
            session.add(workspace)
            await session.flush()
            logger.info(f"Created demo workspace: '{workspace.name}' (ID: {workspace.id})")
        else:
            workspace.name = DEMO_WORKSPACE_NAME
            workspace.description = DEMO_WORKSPACE_DESC
            logger.info(f"Demo workspace already exists: '{workspace.name}' (ID: {workspace.id})")

        # 2. Upsert Agent Definitions
        seeded_agents = []
        for agent_data in DEFAULT_AGENTS:
            agent_stmt = select(AgentDefinition).where(
                AgentDefinition.workspace_id == workspace.id,
                AgentDefinition.agent_type == agent_data["agent_type"],
            )
            agent_res = await session.execute(agent_stmt)
            agent_record = agent_res.scalar_one_or_none()

            if not agent_record:
                agent_record = AgentDefinition(
                    id=uuid.uuid4(),
                    workspace_id=workspace.id,
                    name=agent_data["name"],
                    agent_type=agent_data["agent_type"],
                    description=agent_data["description"],
                    system_instructions=agent_data["system_instructions"],
                    model_config_json=agent_data["model_config_json"],
                    tools=agent_data["tools"],
                )
                session.add(agent_record)
                await session.flush()
                logger.info(f"Seeded agent: '{agent_record.name}' ({agent_record.agent_type})")
            else:
                agent_record.name = agent_data["name"]
                agent_record.description = agent_data["description"]
                agent_record.system_instructions = agent_data["system_instructions"]
                agent_record.model_config_json = agent_data["model_config_json"]
                agent_record.tools = agent_data["tools"]
                logger.info(f"Updated agent: '{agent_record.name}' ({agent_record.agent_type})")

            seeded_agents.append(agent_record)

        # 3. Upsert Default Workflow Definition
        wf_stmt = select(WorkflowDefinition).where(
            WorkflowDefinition.workspace_id == workspace.id,
            WorkflowDefinition.name == DEFAULT_WORKFLOW["name"],
        )
        wf_res = await session.execute(wf_stmt)
        workflow_record = wf_res.scalar_one_or_none()

        if not workflow_record:
            workflow_record = WorkflowDefinition(
                id=uuid.uuid4(),
                workspace_id=workspace.id,
                name=DEFAULT_WORKFLOW["name"],
                description=DEFAULT_WORKFLOW["description"],
                objective=DEFAULT_WORKFLOW["objective"],
                agent_sequence=DEFAULT_WORKFLOW["agent_sequence"],
                approval_required=DEFAULT_WORKFLOW["approval_required"],
            )
            session.add(workflow_record)
            await session.flush()
            logger.info(f"Seeded workflow: '{workflow_record.name}' (ID: {workflow_record.id})")
        else:
            workflow_record.description = DEFAULT_WORKFLOW["description"]
            workflow_record.objective = DEFAULT_WORKFLOW["objective"]
            workflow_record.agent_sequence = DEFAULT_WORKFLOW["agent_sequence"]
            workflow_record.approval_required = DEFAULT_WORKFLOW["approval_required"]
            logger.info(f"Updated workflow: '{workflow_record.name}' (ID: {workflow_record.id})")

        await session.commit()

    await close_database_connection()
    logger.info("STARK demo data seeding completed successfully.")

    return {
        "workspace_id": str(workspace.id),
        "workspace_name": workspace.name,
        "agents_count": len(seeded_agents),
        "workflow_id": str(workflow_record.id),
    }


if __name__ == "__main__":
    result = asyncio.run(seed_demo_data())
    print("\nSeed Summary:")
    print(f"Workspace: {result['workspace_name']} ({result['workspace_id']})")
    print(f"Agents seeded: {result['agents_count']}")
    print(f"Workflow ID: {result['workflow_id']}")
