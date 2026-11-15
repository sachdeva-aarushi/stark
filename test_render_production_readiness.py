"""
Production Readiness Audit and Verification Suite for STARK on Render.

Validates:
1. Production Configuration & Environment Hygiene
2. Groq LLM API Connectivity & Structured Output Parsing
3. Local SentenceTransformer Embedding Provider (384-d vectors)
4. Supabase PostgreSQL & pgvector Vector Operations
5. Supabase Storage (Private document storage bucket)
6. End-to-End Multi-Agent Workflow Execution with Live Groq LLM
7. Human Approval Gate (Suspend -> Checkpoint -> Resume)
8. FastAPI Health & Readiness Endpoints
"""

import asyncio
import io
import os
import sys
import time
import uuid

# Set selector event loop on Windows for asyncpg/psycopg compatibility
if sys.platform == "win32":
    try:
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    except Exception:
        pass

results = []

def report(category: str, name: str, passed: bool, detail: str = ""):
    tag = "PASS" if passed else "FAIL"
    results.append((category, name, passed, detail))
    print(f"  [{tag}] [{category}] {name}" + (f" -> {detail}" if detail else ""), flush=True)


async def main():
    print("=" * 75, flush=True)
    print("STARK PRODUCTION-READINESS AUDIT FOR RENDER DEPLOYMENT", flush=True)
    print("=" * 75, flush=True)

    # --------------------------------------------------------------------------
    # 1. Configuration & Secrets Hygiene
    # --------------------------------------------------------------------------
    print("\n--- 1. Configuration & Secrets Hygiene ---", flush=True)
    from backend.app.core.config import get_settings
    settings = get_settings()

    report("CONFIG", "APP_ENV is production", settings.APP_ENV == "production", f"APP_ENV={settings.APP_ENV}")
    report("CONFIG", "LLM Provider configured", settings.LLM_PROVIDER in ("openai", "groq"), f"provider={settings.LLM_PROVIDER}")
    report("CONFIG", "Groq Base URL configured", "groq.com" in (settings.LLM_BASE_URL or ""), f"base_url={settings.LLM_BASE_URL}")
    report("CONFIG", "LLM Model configured", bool(settings.LLM_MODEL), f"model={settings.LLM_MODEL}")
    
    # Check that LLM_API_KEY is not dummy
    is_real_key = bool(settings.LLM_API_KEY and settings.LLM_API_KEY != "your-api-key-here" and len(settings.LLM_API_KEY) > 20)
    report("CONFIG", "Real Groq API Key active (not mock/placeholder)", is_real_key, f"key_prefix={settings.LLM_API_KEY[:8]}...")

    report("CONFIG", "Embedding Provider is local", settings.EMBEDDING_PROVIDER == "local", f"provider={settings.EMBEDDING_PROVIDER}")
    report("CONFIG", "Embedding Dimension is 384", settings.EMBEDDING_DIMENSION == 384, f"dimension={settings.EMBEDDING_DIMENSION}")
    report("CONFIG", "Supabase PostgreSQL URL active", "supabase.co" in settings.DATABASE_URL, "host=supabase.co")

    # --------------------------------------------------------------------------
    # 2. Local SentenceTransformer Embeddings (384-d)
    # --------------------------------------------------------------------------
    print("\n--- 2. Local SentenceTransformer Embeddings ---", flush=True)
    from backend.app.documents.embeddings.provider import get_embedding_provider, LocalEmbeddingProvider
    embedding_provider = get_embedding_provider()
    
    report("EMBEDDINGS", "Active provider is LocalEmbeddingProvider", isinstance(embedding_provider, LocalEmbeddingProvider))
    report("EMBEDDINGS", "Vector dimension is 384", embedding_provider.dimension == 384, f"dim={embedding_provider.dimension}")
    report("EMBEDDINGS", "No fallback to mock generator", not hasattr(embedding_provider, "_fallback"))

    test_text = "STARK multi-agent workflow orchestration platform enterprise governance"
    t0 = time.perf_counter()
    vec = embedding_provider.embed_query(test_text)
    embed_time = (time.perf_counter() - t0) * 1000
    report("EMBEDDINGS", "Embedding vector output length is exactly 384", len(vec) == 384, f"len={len(vec)}, latency={embed_time:.1f}ms")
    norm = sum(x**2 for x in vec)**0.5
    report("EMBEDDINGS", "Vector is L2-normalized (norm ~ 1.0)", abs(norm - 1.0) < 0.01, f"norm={norm:.4f}")

    # --------------------------------------------------------------------------
    # 3. Groq LLM API & Structured Outputs
    # --------------------------------------------------------------------------
    print("\n--- 3. Groq LLM Integration & Structured Output ---", flush=True)
    from backend.app.services.llm import get_llm, invoke_structured
    from backend.app.models.schemas import Plan
    from langchain_core.messages import HumanMessage, SystemMessage

    llm = get_llm()
    report("LLM", "ChatOpenAI configured for Groq", type(llm).__name__ == "ChatOpenAI")
    
    print("  Testing live Groq API structured output generation...", flush=True)
    t0 = time.perf_counter()
    try:
        messages = [
            SystemMessage(content="You are a strategic planner agent in a workflow system. Return a concise plan."),
            HumanMessage(content="User Query: Audit database indexing and connection pooling performance."),
        ]
        plan: Plan = await invoke_structured(llm, messages, Plan)
        llm_time = (time.perf_counter() - t0) * 1000
        report("LLM", "Live Groq structured invocation succeeded", isinstance(plan, Plan), f"latency={llm_time:.0f}ms")
        report("LLM", "Plan goal generated by Groq", bool(plan.goal), f"goal='{plan.goal[:60]}...'")
        report("LLM", "Plan steps count >= 3", len(plan.steps) >= 3, f"steps={len(plan.steps)}")
    except Exception as exc:
        report("LLM", "Live Groq structured invocation succeeded", False, str(exc))

    # --------------------------------------------------------------------------
    # 4. Supabase Storage
    # --------------------------------------------------------------------------
    print("\n--- 4. Supabase Storage Integration ---", flush=True)
    from backend.app.services.storage import SupabaseStorageService
    test_file_path = f"audit_tests/test_audit_{uuid.uuid4().hex[:8]}.txt"
    test_content = b"STARK production readiness test payload for Supabase Storage verification."
    
    upload_res = await SupabaseStorageService.upload_file(test_content, test_file_path, "text/plain")
    report("STORAGE", "Upload file to Supabase Storage", bool(upload_res), f"path={upload_res}")

    download_bytes = await SupabaseStorageService.download_file(test_file_path)
    report("STORAGE", "Download file from Supabase Storage", download_bytes == test_content, f"bytes={len(download_bytes) if download_bytes else 0}")

    delete_res = await SupabaseStorageService.delete_file(test_file_path)
    report("STORAGE", "Delete file from Supabase Storage", bool(delete_res))

    # --------------------------------------------------------------------------
    # 5. Live Multi-Agent Workflow Execution with Groq
    # --------------------------------------------------------------------------
    print("\n--- 5. End-to-End Workflow Execution (Groq LLM + HITL) ---", flush=True)
    from backend.app.graph.checkpointer import init_checkpointer, close_checkpointer
    from backend.app.graph.workflow import run_custom_workflow, resume_workflow
    from backend.app.services.workflow_runs import get_workflow_run
    from backend.app.db.session import get_db_context

    await init_checkpointer()

    test_query = "Assess data isolation and query performance with pgvector in Supabase."
    print("  Executing custom multi-agent workflow pipeline through Groq...", flush=True)
    t0 = time.perf_counter()
    
    state = await run_custom_workflow(
        agent_sequence=["planner", "document_retrieval", "researcher", "responder"],
        query=test_query,
        approval_required=True,
        workflow_name="Render Production Readiness Verification",
    )
    exec_time = (time.perf_counter() - t0) * 1000
    run_id = state.get("run_id")

    report("WORKFLOW", "Run ID generated", bool(run_id), f"run_id={run_id}")
    report("WORKFLOW", "Pipeline suspended at Human Approval Gate", state.get("status") == "WAITING_FOR_APPROVAL", f"status={state.get('status')}")
    report("WORKFLOW", "Approval status is PENDING", state.get("approval_status") == "PENDING")
    
    final_answer = state.get("final_answer") or {}
    report("WORKFLOW", "Executive answer synthesized by Groq", bool(final_answer.get("answer")), f"len={len(final_answer.get('answer', ''))}")
    report("WORKFLOW", "Key points extracted by Groq", len(final_answer.get("key_points", [])) >= 2, f"points={len(final_answer.get('key_points', []))}")
    report("WORKFLOW", "Calibrated confidence score valid", 0.0 <= final_answer.get("confidence", 0.0) <= 1.0, f"conf={final_answer.get('confidence')}")

    # Resume workflow with approval decision
    print(f"  Submitting APPROVE decision for run {run_id}...", flush=True)
    resumed = await resume_workflow(
        run_id=run_id,
        decision="APPROVE",
        feedback="Verified against live Groq output. Ready for Render deployment.",
        decided_by="render_deploy_auditor",
    )
    report("WORKFLOW", "Resumed status transitioned to COMPLETED", resumed.get("status") == "COMPLETED", f"status={resumed.get('status')}")
    report("WORKFLOW", "Approval status transitioned to APPROVED", resumed.get("approval_status") == "APPROVED", f"approval={resumed.get('approval_status')}")

    # Verify database persistence of steps and audit trail
    async with get_db_context() as session:
        db_run = await get_workflow_run(session, run_id=run_id)
        report("DATABASE", "Workflow run record persisted in Supabase", db_run is not None)
        if db_run:
            report("DATABASE", "Run steps persisted in Supabase", len(db_run.steps) >= 3, f"steps_count={len(db_run.steps)}")
            report("DATABASE", "Approval audit record persisted in Supabase", len(db_run.approvals) >= 1, f"approvals_count={len(db_run.approvals)}")

    # --------------------------------------------------------------------------
    # 6. FastAPI Health & Readiness Endpoints
    # --------------------------------------------------------------------------
    print("\n--- 6. FastAPI API Health & Readiness Endpoints ---", flush=True)
    import httpx
    from backend.app.main import app

    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
        r = await client.get("/api/v1/health")
        report("API", "GET /api/v1/health returns 200", r.status_code == 200, f"status={r.status_code}")
        h_data = r.json() if r.status_code == 200 else {}
        report("API", "Health reports database connected", h_data.get("database") == "connected", f"db={h_data.get('database')}")

        r = await client.get("/api/v1/health/ready")
        report("API", "GET /api/v1/health/ready returns 200", r.status_code == 200, f"status={r.status_code}")
        ready_data = r.json() if r.status_code == 200 else {}
        report("API", "Readiness reports service ready", ready_data.get("status") == "ready", f"ready={ready_data.get('status')}")

        # Check CORS headers
        r_cors = await client.options(
            "/api/v1/health",
            headers={
                "Origin": "https://stark-frontend.onrender.com",
                "Access-Control-Request-Method": "GET",
            },
        )
        has_cors = r_cors.headers.get("access-control-allow-origin") == "https://stark-frontend.onrender.com"
        report("API", "CORS accepts Render frontend origin", has_cors, f"allow_origin={r_cors.headers.get('access-control-allow-origin')}")

    try:
        await close_checkpointer()
    except Exception:
        pass

    # --------------------------------------------------------------------------
    # Final Scorecard
    # --------------------------------------------------------------------------
    print("\n" + "=" * 75, flush=True)
    passed = sum(1 for _, _, p, _ in results if p)
    failed = sum(1 for _, _, p, _ in results if not p)
    print(f"AUDIT SUMMARY: {passed} passed, {failed} failed, {len(results)} total", flush=True)
    print("=" * 75, flush=True)

    if failed:
        print("\nFailed Checks:", flush=True)
        for cat, name, p, detail in results:
            if not p:
                print(f"  [X] [{cat}] {name}: {detail}", flush=True)

    return 0 if failed == 0 else 1


if __name__ == "__main__":
    code = asyncio.run(main())
    sys.exit(code)
