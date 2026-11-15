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
from datetime import datetime, timezone, timedelta
from typing import Any, Dict, List
from sqlalchemy import func, select

from backend.app.core.logging import get_logger, setup_logging
from backend.app.db.models.agent_definition import AgentDefinition
from backend.app.db.models.workflow_approval import WorkflowApproval
from backend.app.db.models.workflow_definition import WorkflowDefinition
from backend.app.db.models.workflow_run import WorkflowRun
from backend.app.db.models.workflow_step import WorkflowStep
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

        # 4. Upsert Seeded Historical Workflow Runs for Demo & Dashboard
        demo_runs_data = [
            {
                "id": uuid.UUID("11111111-1111-1111-1111-111111111111"),
                "request_id": uuid.UUID("11111111-1111-1111-1111-111111111100"),
                "query": "Evaluate zero-trust cloud security posture and pgvector embedding isolation controls.",
                "status": "COMPLETED",
                "approval_status": "APPROVED",
                "offset_hours": 4,
                "duration_ms": 2410,
                "final_answer": "The STARK enterprise security architecture enforces end-to-end zero-trust principles. All document chunks and 384-dimensional pgvector embeddings are strictly partitioned by workspace_id. Supabase Storage buckets enforce private ACLs, ensuring multi-tenant isolation and cryptographic integrity.",
                "key_points": [
                    "Zero-trust isolation verified across all agent nodes",
                    "Durable pgvector similarity queries partitioned by workspace",
                    "Automated cryptographic hash attestation for each state transition",
                ],
                "confidence": 0.96,
                "val_status": "PASS",
                "val_score": 0.95,
                "sources": [
                    {
                        "filename": "stark_enterprise_security_architecture_2026.pdf",
                        "page_number": 4,
                        "snippet": "Enterprise authentication requires zero-trust multi-factor identity enforcement combined with hardware token attestation...",
                        "similarity_score": 0.94,
                    }
                ],
                "approval": {
                    "id": uuid.UUID("11111111-1111-1111-1111-111111111101"),
                    "status": "APPROVED",
                    "decision": "APPROVE",
                    "decided_by": "senior_architect",
                    "feedback": "Verified technical accuracy and provenance. Approved for publishing.",
                },
            },
            {
                "id": uuid.UUID("22222222-2222-2222-2222-222222222222"),
                "request_id": uuid.UUID("22222222-2222-2222-2222-222222222200"),
                "query": "Analyze Q3 financial compliance audit findings and federal AI governance alignment.",
                "status": "COMPLETED",
                "approval_status": "APPROVED",
                "offset_hours": 2,
                "duration_ms": 1890,
                "final_answer": "Q3 audit results confirm 99.98% compliance with federal AI governance mandates. Automated vector embeddings ensure sub-millisecond similarity lookups without cross-tenant data leakage. Financial metrics were reconciled with zero computational variance.",
                "key_points": [
                    "99.98% compliance achieved with federal AI governance",
                    "Zero computational variance across quantitative analysis steps",
                    "Audited provenance trails verified in PostgreSQL",
                ],
                "confidence": 0.93,
                "val_status": "PASS",
                "val_score": 0.92,
                "sources": [
                    {
                        "filename": "q3_financial_compliance_and_governance.pdf",
                        "page_number": 11,
                        "snippet": "Q3 audit results confirm 99.98% compliance with federal AI governance mandates...",
                        "similarity_score": 0.89,
                    }
                ],
                "approval": {
                    "id": uuid.UUID("22222222-2222-2222-2222-222222222201"),
                    "status": "APPROVED",
                    "decision": "APPROVE",
                    "decided_by": "compliance_director",
                    "feedback": "Approved. Reconciled metrics meet SEC guidelines.",
                },
            },
            {
                "id": uuid.UUID("33333333-3333-3333-3333-333333333333"),
                "request_id": uuid.UUID("33333333-3333-3333-3333-333333333300"),
                "query": "Conduct procurement policy vendor risk assessment for cloud compute contracts.",
                "status": "WAITING_FOR_APPROVAL",
                "approval_status": "PENDING",
                "offset_hours": 0.5,
                "duration_ms": 1320,
                "final_answer": "Draft vendor evaluation indicates high operational reliability with low financial default risk. Human review gate is required before approving enterprise procurement contracts.",
                "key_points": [
                    "Vendor meets enterprise tier-1 uptime thresholds (99.99%)",
                    "Contract terms require supervisor approval prior to execution",
                    "Compliance checks passed without exceptions",
                ],
                "confidence": 0.89,
                "val_status": "PASS",
                "val_score": 0.88,
                "sources": [],
                "approval": {
                    "id": uuid.UUID("33333333-3333-3333-3333-333333333301"),
                    "status": "PENDING",
                    "decision": None,
                    "decided_by": None,
                    "feedback": None,
                },
            },
            {
                "id": uuid.UUID("44444444-4444-4444-4444-444444444444"),
                "request_id": uuid.UUID("44444444-4444-4444-4444-444444444400"),
                "query": "Execute unauthorized kernel inspection probe across container nodes.",
                "status": "FAILED",
                "approval_status": "REJECTED",
                "offset_hours": 1,
                "duration_ms": 840,
                "final_answer": "Execution aborted by Guardrail Validation. The query requested unauthorized host-level inspection which violates platform security constraints.",
                "key_points": ["Guardrails triggered on unauthorized system call attempt"],
                "confidence": 0.20,
                "val_status": "FAIL",
                "val_score": 0.20,
                "errors": ["Security guardrail blocked unauthorized host-level query"],
                "sources": [],
                "approval": {
                    "id": uuid.UUID("44444444-4444-4444-4444-444444444401"),
                    "status": "REJECTED",
                    "decision": "REJECT",
                    "decided_by": "security_officer",
                    "feedback": "Violates zero-trust host isolation policy.",
                },
            },
        ]

        now = datetime.now(timezone.utc)
        for rdata in demo_runs_data:
            existing_run = await session.get(WorkflowRun, rdata["id"])
            if not existing_run:
                run_start = now - timedelta(hours=rdata["offset_hours"])
                run_end = run_start + timedelta(milliseconds=rdata["duration_ms"]) if rdata["status"] != "WAITING_FOR_APPROVAL" else None

                new_run = WorkflowRun(
                    id=rdata["id"],
                    request_id=rdata["request_id"],
                    user_query=rdata["query"],
                    status=rdata["status"],
                    approval_status=rdata["approval_status"],
                    started_at=run_start,
                    completed_at=run_end,
                    duration_ms=rdata["duration_ms"],
                    final_answer=rdata["final_answer"],
                    key_points=rdata["key_points"],
                    confidence=rdata["confidence"],
                    validation_status=rdata["val_status"],
                    validation_score=rdata["val_score"],
                    errors=rdata.get("errors", []),
                    metadata_json={
                        "sources": rdata.get("sources", []),
                        "validation": {
                            "status": rdata["val_status"],
                            "score": rdata["val_score"],
                        },
                    },
                )
                session.add(new_run)
                await session.flush()

                # Add sample steps
                step_agents = ["planner", "document_retrieval", "data_analysis", "researcher", "responder", "validation"]
                if rdata["status"] == "WAITING_FOR_APPROVAL":
                    step_agents = ["planner", "document_retrieval", "data_analysis", "researcher", "responder"]

                for s_idx, ag_name in enumerate(step_agents):
                    step = WorkflowStep(
                        id=uuid.uuid4(),
                        run_id=new_run.id,
                        agent_name=ag_name,
                        step_order=s_idx + 1,
                        status="COMPLETED",
                        started_at=run_start + timedelta(milliseconds=s_idx * 300),
                        completed_at=run_start + timedelta(milliseconds=(s_idx + 1) * 300),
                        duration_ms=300,
                        input_data={"agent": ag_name, "query": rdata["query"]},
                        output_data={"status": "success", "summary": f"{ag_name} stage completed successfully."},
                    )
                    session.add(step)

                # Add approval record
                app_data = rdata["approval"]
                approval = WorkflowApproval(
                    id=app_data["id"],
                    workflow_run_id=new_run.id,
                    status=app_data["status"],
                    decision=app_data["decision"],
                    decided_by=app_data["decided_by"],
                    feedback=app_data["feedback"],
                    requested_at=run_start + timedelta(milliseconds=1200),
                    decided_at=run_end if app_data["decision"] else None,
                    revision_count=0,
                )
                session.add(approval)
                logger.info(f"Seeded historical workflow run: '{new_run.user_query[:40]}...' ({new_run.status})")

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
