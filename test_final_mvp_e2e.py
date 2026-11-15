"""
STARK Final MVP End-to-End User Journey Integration Test

Validates the complete enterprise MVP lifecycle against live Supabase PostgreSQL
and the LangGraph multi-agent execution runtime:
1. Workspace Information Inspection (Mock Login -> Demo Workspace)
2. Dashboard Metrics (Real database-backed stats & seeded history)
3. Knowledge Base Management (Document ingestion & semantic pgvector search)
4. Agent Management (List, create, configure specialized agent)
5. Workflow Studio (Create custom multi-agent workflow definition)
6. Workflow Execution (Execute pipeline, observe agent steps, suspend at approval gate)
7. Approvals Queue (Inspect pending approval requests)
8. Human Review Decision (Approve execution, resume LangGraph from checkpoint)
9. Execution History & Auditing (Verify full execution steps, citations, and approval trail)
"""

import asyncio
import io
import os
import sys
import uuid

# Configure environment before imports
os.environ["DATABASE_URL"] = (
    "postgresql+asyncpg://postgres:admin%40123321hehe@db.eliextckdrxvhesflorz.supabase.co:5432/postgres"
)
os.environ["APP_ENV"] = "development"
os.environ["LLM_PROVIDER"] = "mock"
os.environ["APPROVAL_ENABLED"] = "true"
os.environ["VALIDATION_ENABLED"] = "false"

WORKSPACE_ID = "69b87246-a2bb-4c67-bfc1-2167595be2db"

results: list[tuple[str, bool, str]] = []


def report(name: str, passed: bool, detail: str = ""):
    tag = "PASS" if passed else "FAIL"
    results.append((name, passed, detail))
    print(f"  [{tag}] {name}" + (f" — {detail}" if detail else ""), flush=True)


async def main():
    import httpx
    from backend.app.main import app
    from backend.app.graph.checkpointer import init_checkpointer, close_checkpointer

    print("\n" + "=" * 70, flush=True)
    print("STARK MVP — FINAL END-TO-END USER JOURNEY VERIFICATION", flush=True)
    print("=" * 70, flush=True)

    await init_checkpointer()

    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:

        # ----------------------------------------------------------------------
        # Journey Stage 1: Workspace Inspection & Seeded Identity
        # ----------------------------------------------------------------------
        print("\n--- STAGE 1: Workspace Identity & Demo Entry ---", flush=True)
        r = await client.get("/api/v1/workspaces/current")
        report("Fetch Current Workspace (GET)", r.status_code == 200, f"status={r.status_code}")
        ws_data = r.json() if r.status_code == 200 else {}
        report("Workspace Name matches", ws_data.get("name") == "STARK Demo Workspace")
        report("Workspace Slug matches", ws_data.get("slug") == "stark-demo")
        report("Agents Count >= 6", ws_data.get("agents_count", 0) >= 6, f"count={ws_data.get('agents_count')}")

        # ----------------------------------------------------------------------
        # Journey Stage 2: Dashboard Statistics
        # ----------------------------------------------------------------------
        print("\n--- STAGE 2: Real Database-Backed Dashboard Metrics ---", flush=True)
        r = await client.get("/api/v1/workflows/stats")
        report("Fetch Workflow Stats (GET)", r.status_code == 200, f"status={r.status_code}")
        stats = r.json() if r.status_code == 200 else {}
        report("Total Runs >= 4 (seeded)", stats.get("total_runs", 0) >= 4, f"total={stats.get('total_runs')}")
        report("Completed Runs present", stats.get("completed_runs", 0) >= 2, f"completed={stats.get('completed_runs')}")
        report("Pending Approvals present", stats.get("awaiting_approval", 0) >= 1, f"pending={stats.get('awaiting_approval')}")

        # ----------------------------------------------------------------------
        # Journey Stage 3: Knowledge Base Management & Semantic RAG
        # ----------------------------------------------------------------------
        print("\n--- STAGE 3: Knowledge Base Document Ingestion & Search ---", flush=True)
        doc_content = b"""# STARK Autonomous Security Architecture 2026
Page 1: Multi-Agent Governance
Every agent state transition is recorded with deterministic execution hashes.
Human review gates are strictly enforced before high-impact decisions.

Page 2: Vector Isolation
All 384-dimensional pgvector embeddings are strictly scoped to the workspace.
Document chunks are extracted and chunked with overlapping windows.
"""
        files = {
            "file": ("stark_e2e_verification_spec.txt", io.BytesIO(doc_content), "text/plain")
        }
        data = {"workspace_id": WORKSPACE_ID}
        r = await client.post("/api/v1/documents", files=files, data=data)
        report("Upload Document (POST)", r.status_code == 201, f"status={r.status_code}")
        doc_res = r.json() if r.status_code == 201 else {}
        doc_id = doc_res.get("document_id") or doc_res.get("id")
        report("Document Chunk Count > 0", doc_res.get("chunk_count", 0) > 0, f"chunks={doc_res.get('chunk_count')}")

        # Semantic Search Query
        search_payload = {"query": "multi-agent governance and human review gates", "top_k": 3}
        r = await client.post(f"/api/v1/workspaces/{WORKSPACE_ID}/rag/search", json=search_payload)
        report("Semantic Search via pgvector (POST)", r.status_code == 200, f"status={r.status_code}")
        search_res = r.json() if r.status_code == 200 else {}
        results_list = search_res.get("results", [])
        report("Relevant Chunks Retrieved", len(results_list) > 0, f"found={len(results_list)}")

        # ----------------------------------------------------------------------
        # Journey Stage 4: Agent Management
        # ----------------------------------------------------------------------
        print("\n--- STAGE 4: Agent Management ---", flush=True)
        r = await client.get(f"/api/v1/workspaces/{WORKSPACE_ID}/agents")
        report("List Workspace Agents (GET)", r.status_code == 200, f"status={r.status_code}")
        agents = r.json().get("items", []) if r.status_code == 200 else []
        report("Default Agents Exist", len(agents) >= 6, f"count={len(agents)}")

        custom_agent_payload = {
            "name": "E2E Protocol Auditor",
            "description": "Autonomous verification specialist for STARK MVP testing.",
            "agent_type": "validation",
            "system_instructions": "Verify all computational outputs and ensure zero hallucination.",
            "model_config": {"model": "gpt-4o", "temperature": 0.1, "knowledge_access": True},
            "tools": ["document_retrieval", "data_analysis"],
        }
        r = await client.post(f"/api/v1/workspaces/{WORKSPACE_ID}/agents", json=custom_agent_payload)
        report("Create Custom Agent (POST)", r.status_code == 201, f"status={r.status_code}")
        created_agent = r.json() if r.status_code == 201 else {}
        created_agent_id = created_agent.get("id")

        # ----------------------------------------------------------------------
        # Journey Stage 5: Workflow Studio Configuration
        # ----------------------------------------------------------------------
        print("\n--- STAGE 5: Workflow Studio Pipeline Creation ---", flush=True)
        custom_wf_payload = {
            "name": "E2E Strategic Review & Review Gate Pipeline",
            "description": "Multi-agent pipeline testing human-in-the-loop approval gate.",
            "objective": "Deconstruct user query, retrieve grounding context, synthesize executive response, and gate for human approval.",
            "agent_sequence": ["planner", "document_retrieval", "researcher", "responder"],
            "approval_required": True,
        }
        r = await client.post(f"/api/v1/workspaces/{WORKSPACE_ID}/workflows", json=custom_wf_payload)
        report("Create Workflow Definition (POST)", r.status_code == 201, f"status={r.status_code}")
        created_wf = r.json() if r.status_code == 201 else {}
        wf_id = created_wf.get("id")
        report("Workflow ID valid", bool(wf_id), f"id={wf_id[:8]}...")
        report("Approval Required is True", created_wf.get("approval_required") is True)

        # ----------------------------------------------------------------------
        # Journey Stage 6: Workflow Execution & Approval Gate Suspension
        # ----------------------------------------------------------------------
        print("\n--- STAGE 6: Workflow Execution & Human Approval Gate ---", flush=True)
        exec_payload = {
            "query": "Evaluate platform compliance, pgvector isolation, and cryptographic security."
        }
        print("  Triggering multi-agent execution with approval gate enabled...", flush=True)
        r = await client.post(f"/api/v1/workspaces/{WORKSPACE_ID}/workflows/{wf_id}/execute", json=exec_payload)
        if r.status_code != 200:
            print(f"  EXECUTION FAILED ({r.status_code}): {r.text}", flush=True)
        report("Execute Workflow Endpoint (POST)", r.status_code == 200, f"status={r.status_code}")
        exec_data = r.json() if r.status_code == 200 else {}
        run_id = exec_data.get("run_id")
        report("Run ID Generated", bool(run_id), f"run_id={run_id}")
        report(
            "Workflow Status is WAITING_FOR_APPROVAL",
            exec_data.get("status") in ("waiting_for_approval", "pending"),
            f"status={exec_data.get('status')}",
        )
        report("Approval Status is PENDING", exec_data.get("approval_status") == "PENDING")

        # ----------------------------------------------------------------------
        # Journey Stage 7: Approvals Queue Inspection
        # ----------------------------------------------------------------------
        print("\n--- STAGE 7: Pending Approvals Queue ---", flush=True)
        r = await client.get("/api/v1/approvals/pending")
        report("List Pending Approvals (GET)", r.status_code == 200, f"status={r.status_code}")
        pending_list = r.json().get("items", []) if r.status_code == 200 else []
        found_pending = any(item.get("run_id") == run_id for item in pending_list)
        report("Suspended Run in Pending Approvals", found_pending, f"pending_total={len(pending_list)}")

        # ----------------------------------------------------------------------
        # Journey Stage 8: Human Review Decision & LangGraph Checkpoint Resume
        # ----------------------------------------------------------------------
        print("\n--- STAGE 8: Human Approval Decision & Resumption ---", flush=True)
        decision_payload = {
            "decision": "APPROVE",
            "feedback": "Approved by Senior System Architect. Technical provenance verified.",
            "decided_by": "lead_architect",
        }
        print(f"  Submitting APPROVE decision for run {run_id}...", flush=True)
        r = await client.post(f"/api/v1/workflows/{run_id}/approval", json=decision_payload)
        report("Submit Approval Decision (POST)", r.status_code == 200, f"status={r.status_code}")
        approval_res = r.json() if r.status_code == 200 else {}
        report(
            "Run Status transitioned to COMPLETED",
            approval_res.get("status") == "COMPLETED",
            f"status={approval_res.get('status')}",
        )
        report(
            "Approval Status transitioned to APPROVED",
            approval_res.get("approval_status") == "APPROVED",
            f"approval_status={approval_res.get('approval_status')}",
        )

        # ----------------------------------------------------------------------
        # Journey Stage 9: Execution History & Step Auditing
        # ----------------------------------------------------------------------
        print("\n--- STAGE 9: Execution History & Step Auditing ---", flush=True)
        r = await client.get(f"/api/v1/workflows/{run_id}")
        report("Get Detailed Workflow Run (GET)", r.status_code == 200, f"status={r.status_code}")
        detail = r.json() if r.status_code == 200 else {}
        report("Final Answer Persisted", bool(detail.get("answer")), f"len={len(detail.get('answer', ''))}")
        report("Key Points Persisted", len(detail.get("key_points", [])) > 0, f"points={len(detail.get('key_points', []))}")
        report("Calibrated Confidence >= 0.8", detail.get("confidence", 0) >= 0.8, f"confidence={detail.get('confidence')}")

        steps = detail.get("steps", [])
        report("Sequential Agent Steps Persisted", len(steps) >= 4, f"step_count={len(steps)}")
        step_names = [s.get("agent_name") for s in steps]
        report("Planner Step Recorded", "planner" in step_names)
        report("Researcher Step Recorded", "researcher" in step_names)
        report("Responder Step Recorded", "responder" in step_names)

        approvals_hist = detail.get("approvals", [])
        report("Approval Record in Audit Trail", len(approvals_hist) > 0, f"approvals={len(approvals_hist)}")
        if approvals_hist:
            last_app = approvals_hist[-1]
            report("Decided by matches", last_app.get("decided_by") == "lead_architect")
            report("Decision is APPROVE", last_app.get("decision") == "APPROVE")
            report("Feedback persisted", "Approved by Senior System Architect" in (last_app.get("feedback") or ""))

        # Cleanup custom created entities
        if created_agent_id:
            await client.delete(f"/api/v1/workspaces/{WORKSPACE_ID}/agents/{created_agent_id}")
        if wf_id:
            await client.delete(f"/api/v1/workspaces/{WORKSPACE_ID}/workflows/{wf_id}")

    try:
        await close_checkpointer()
    except Exception:
        pass

    # --------------------------------------------------------------------------
    # Final Summary
    # --------------------------------------------------------------------------
    print("\n" + "=" * 70, flush=True)
    passed = sum(1 for _, p, _ in results if p)
    failed = sum(1 for _, p, _ in results if not p)
    print(f"FINAL MVP RESULTS: {passed} passed, {failed} failed, {len(results)} total", flush=True)
    print("=" * 70, flush=True)

    if failed:
        print("\nFailed Tests Details:", flush=True)
        for name, p, detail in results:
            if not p:
                print(f"  [X] {name}: {detail}", flush=True)

    return 0 if failed == 0 else 1


if __name__ == "__main__":
    code = asyncio.run(main())
    sys.exit(code)
