"""
Prompt 3 Integration Test — Agent Management & Workflow Studio

Tests Agent CRUD, Workflow Definition CRUD, agent_sequence validation,
and custom workflow execution against LIVE Supabase PostgreSQL via
FastAPI's ASGI test client.
"""

import asyncio
import sys
import os

# Ensure backend module path
sys.path.insert(0, os.path.dirname(__file__))

# Configure env for live Supabase
os.environ["DATABASE_URL"] = (
    "postgresql+asyncpg://postgres:admin%40123321hehe@db.eliextckdrxvhesflorz.supabase.co:5432/postgres"
)
os.environ["APP_ENV"] = "development"
os.environ["LLM_PROVIDER"] = "mock"
os.environ["APPROVAL_ENABLED"] = "false"
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

    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
        # ======================================================================
        # 1. Agent CRUD
        # ======================================================================
        print("\n1. Agent CRUD")

        # 1a. Create Agent
        agent_payload = {
            "name": "Test Auditor Agent",
            "description": "Integration test agent for Prompt 3 validation",
            "agent_type": "planner",
            "system_instructions": "You are a test auditor agent.",
            "model_config": {"model": "gpt-4o-mini", "temperature": 0.3},
            "tools": ["web_search", "data_analysis"],
        }
        r = await client.post(f"/api/v1/workspaces/{WORKSPACE_ID}/agents", json=agent_payload)
        report("Create Agent (POST)", r.status_code == 201, f"status={r.status_code}")
        agent_data = r.json() if r.status_code == 201 else {}
        agent_id = agent_data.get("id", "")
        report("Agent has ID", bool(agent_id), f"id={agent_id[:8]}...")

        # 1b. List Agents
        r = await client.get(f"/api/v1/workspaces/{WORKSPACE_ID}/agents")
        report("List Agents (GET)", r.status_code == 200, f"status={r.status_code}")
        agents_list = r.json().get("items", []) if r.status_code == 200 else []
        found = any(a["id"] == agent_id for a in agents_list)
        report("Created agent in list", found, f"total={len(agents_list)}")

        # 1c. Get Single Agent
        r = await client.get(f"/api/v1/workspaces/{WORKSPACE_ID}/agents/{agent_id}")
        report("Get Agent (GET)", r.status_code == 200, f"status={r.status_code}")

        # 1d. Update Agent
        update_payload = {
            "name": "Updated Auditor Agent",
            "description": "Updated description",
            "model_config": {"model": "gpt-4o", "temperature": 0.7},
            "tools": ["web_search", "code_execution", "api_integration"],
        }
        r = await client.put(f"/api/v1/workspaces/{WORKSPACE_ID}/agents/{agent_id}", json=update_payload)
        report("Update Agent (PUT)", r.status_code == 200, f"status={r.status_code}")
        if r.status_code == 200:
            updated = r.json()
            report("Agent name updated", updated.get("name") == "Updated Auditor Agent")
            report("Agent tools updated", len(updated.get("tools", [])) == 3, f"tools={updated.get('tools')}")

        # 1e. Delete Agent
        r = await client.delete(f"/api/v1/workspaces/{WORKSPACE_ID}/agents/{agent_id}")
        report("Delete Agent (DELETE)", r.status_code == 200, f"status={r.status_code}")

        # Verify deletion
        r = await client.get(f"/api/v1/workspaces/{WORKSPACE_ID}/agents/{agent_id}")
        report("Agent deleted (404)", r.status_code == 404)

        # ======================================================================
        # 2. Workflow Definition CRUD
        # ======================================================================
        print("\n2. Workflow Definition CRUD")

        # 2a. Create Workflow
        wf_payload = {
            "name": "Test Research Pipeline",
            "description": "Integration test workflow for Prompt 3",
            "objective": "Validate custom pipeline execution end-to-end",
            "agent_sequence": ["planner", "researcher", "responder"],
            "approval_required": False,
        }
        r = await client.post(f"/api/v1/workspaces/{WORKSPACE_ID}/workflows", json=wf_payload)
        report("Create Workflow (POST)", r.status_code == 201, f"status={r.status_code}")
        wf_data = r.json() if r.status_code == 201 else {}
        wf_id = wf_data.get("id", "")
        report("Workflow has ID", bool(wf_id), f"id={wf_id[:8]}...")
        report(
            "Workflow agent_sequence correct",
            wf_data.get("agent_sequence") == ["planner", "researcher", "responder"],
        )

        # 2b. List Workflows
        r = await client.get(f"/api/v1/workspaces/{WORKSPACE_ID}/workflows")
        report("List Workflows (GET)", r.status_code == 200, f"status={r.status_code}")

        # 2c. Get Single Workflow
        r = await client.get(f"/api/v1/workspaces/{WORKSPACE_ID}/workflows/{wf_id}")
        report("Get Workflow (GET)", r.status_code == 200, f"status={r.status_code}")

        # 2d. Update Workflow
        wf_update = {
            "name": "Updated Research Pipeline",
            "agent_sequence": ["planner", "document_retrieval", "researcher", "responder"],
            "approval_required": True,
        }
        r = await client.put(f"/api/v1/workspaces/{WORKSPACE_ID}/workflows/{wf_id}", json=wf_update)
        report("Update Workflow (PUT)", r.status_code == 200, f"status={r.status_code}")
        if r.status_code == 200:
            updated_wf = r.json()
            report("Workflow name updated", updated_wf.get("name") == "Updated Research Pipeline")
            report(
                "Workflow sequence updated",
                len(updated_wf.get("agent_sequence", [])) == 4,
                f"seq={updated_wf.get('agent_sequence')}",
            )

        # 2e. Execute Workflow Definition
        exec_payload = {
            "query": "Assess compliance risk and strategic governance for STARK in 2026."
        }
        print("  Executing custom workflow...")
        r = await client.post(
            f"/api/v1/workspaces/{WORKSPACE_ID}/workflows/{wf_id}/execute",
            json=exec_payload,
        )
        report("Execute Workflow (POST)", r.status_code == 200, f"status={r.status_code}")
        if r.status_code == 200:
            exec_res = r.json()
            report("Workflow run_id returned", bool(exec_res.get("run_id")), f"run_id={exec_res.get('run_id')}")
            report("Workflow execution status", exec_res.get("status") in ["completed", "waiting_for_approval"], f"status={exec_res.get('status')}")
            report("Workflow answer present", bool(exec_res.get("answer")), f"len={len(exec_res.get('answer', ''))}")


        # ======================================================================
        # 3. Validation — Reject Invalid Configurations (400 Bad Request)
        # ======================================================================
        print("\n3. Validation")

        # 3a. Empty agent_sequence
        r = await client.post(
            f"/api/v1/workspaces/{WORKSPACE_ID}/workflows",
            json={
                "name": "Empty Pipeline",
                "agent_sequence": [],
            },
        )
        report("Reject empty agent_sequence (400)", r.status_code == 400, f"status={r.status_code}")

        # 3b. Unknown agent name
        r = await client.post(
            f"/api/v1/workspaces/{WORKSPACE_ID}/workflows",
            json={
                "name": "Invalid Pipeline",
                "agent_sequence": ["planner", "nonexistent_agent"],
            },
        )
        report("Reject unknown agent name (400)", r.status_code == 400, f"status={r.status_code}")

        # 3c. Update with empty sequence
        r = await client.put(
            f"/api/v1/workspaces/{WORKSPACE_ID}/workflows/{wf_id}",
            json={"agent_sequence": []},
        )
        report("Reject update empty sequence (400)", r.status_code == 400, f"status={r.status_code}")

        # 3d. Update with invalid agent
        r = await client.put(
            f"/api/v1/workspaces/{WORKSPACE_ID}/workflows/{wf_id}",
            json={"agent_sequence": ["planner", "fake_agent"]},
        )
        report("Reject update invalid agent (400)", r.status_code == 400, f"status={r.status_code}")

        # ======================================================================
        # 4. Cleanup — Delete test workflow
        # ======================================================================
        print("\n4. Cleanup")

        r = await client.delete(f"/api/v1/workspaces/{WORKSPACE_ID}/workflows/{wf_id}")
        report("Delete Workflow (DELETE)", r.status_code == 200, f"status={r.status_code}")

        r = await client.get(f"/api/v1/workspaces/{WORKSPACE_ID}/workflows/{wf_id}")
        report("Workflow deleted (404)", r.status_code == 404)

    # ======================================================================
    # Summary
    # ======================================================================
    print("\n" + "=" * 60)
    passed = sum(1 for _, p, _ in results if p)
    failed = sum(1 for _, p, _ in results if not p)
    print(f"RESULTS: {passed} passed, {failed} failed, {len(results)} total")

    if failed:
        print("\nFAILED TESTS:")
        for name, p, detail in results:
            if not p:
                print(f"  - {name}: {detail}")

    print("=" * 60)
    return 0 if failed == 0 else 1


if __name__ == "__main__":
    code = asyncio.run(main())
    sys.exit(code)
