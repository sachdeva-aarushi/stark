import asyncio
import httpx
from backend.app.main import app

async def test_api():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Health check
        res_health = await client.get("/api/v1/health")
        assert res_health.status_code == 200, res_health.text
        print("1. Health OK:", res_health.json())

        # 2. Current workspace
        res_ws = await client.get("/api/v1/workspaces/current")
        assert res_ws.status_code == 200, res_ws.text
        ws = res_ws.json()
        print("2. Current workspace OK:", ws["name"], "| agents_count =", ws["agents_count"], "| workflows_count =", ws["workflows_count"])
        assert ws["slug"] == "stark-demo"
        assert ws["agents_count"] == 6
        assert ws["workflows_count"] == 1
        ws_id = ws["id"]

        # 3. Agents in workspace
        res_agents = await client.get(f"/api/v1/workspaces/{ws_id}/agents")
        assert res_agents.status_code == 200, res_agents.text
        agents = res_agents.json()
        print("3. Agents OK: total =", agents["total"])
        assert agents["total"] == 6
        for a in agents["items"]:
            print(f"   - {a['name']} [{a['agent_type']}] (ID: {a['id']})")

        # 4. Workflows in workspace
        res_wf = await client.get(f"/api/v1/workspaces/{ws_id}/workflows")
        assert res_wf.status_code == 200, res_wf.text
        wf = res_wf.json()
        print("4. Workflows OK: total =", wf["total"])
        assert wf["total"] == 1
        for w in wf["items"]:
            print(f"   - {w['name']} (Seq: {w['agent_sequence']})")

        print("\n>>> ALL 4 STARK FOUNDATION ENDPOINTS VERIFIED AGAINST SUPABASE! <<<")

if __name__ == "__main__":
    asyncio.run(test_api())
