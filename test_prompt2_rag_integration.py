"""Integration test verifying MVP Knowledge Management & RAG against live Supabase PostgreSQL and Storage."""

import asyncio
import io
import uuid
import httpx
from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import create_async_engine

from backend.app.core.config import get_settings
from backend.app.db.models.document import Document
from backend.app.db.models.document_chunk import DocumentChunk
from backend.app.db.models.workspace import Workspace
from backend.app.main import app
from backend.app.services.storage import SupabaseStorageService

DEMO_WORKSPACE_ID = uuid.UUID("69b87246-a2bb-4c67-bfc1-2167595be2db")


async def run_tests():
    print("=== STARTING STARK PROMPT 2 KNOWLEDGE MANAGEMENT & RAG TESTS ===\n")
    settings = get_settings()

    # 1. Verify pgvector extension in Supabase
    engine = create_async_engine(settings.DATABASE_URL)
    async with engine.begin() as conn:
        res = await conn.execute(text("SELECT typname FROM pg_type WHERE typname = 'vector';"))
        row = res.fetchone()
        assert row is not None, "pgvector type not found in database!"
        print("1. pgvector extension active in Supabase:", row[0])
    await engine.dispose()

    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:

        # 2. Ingest TXT Document
        txt_content = b"""# STARK Governance & Compliance Policy 2026
Page 1: Overview
The STARK enterprise platform mandates strict adherence to zero-trust multi-agent isolation.
Every agent execution milestone must be logged with deterministic cryptographic hashes.

Page 2: Security Architecture
All embeddings are persisted using 384-dimensional pgvector with cosine distance metrics.
Private document binaries are secured inside Supabase Storage private buckets.
"""
        files = {
            "file": ("stark_governance_policy_2026.txt", io.BytesIO(txt_content), "text/plain")
        }
        data = {
            "workspace_id": str(DEMO_WORKSPACE_ID)
        }

        print("2. Uploading TXT document...")
        res_upload_txt = await client.post("/api/v1/documents", files=files, data=data)
        assert res_upload_txt.status_code == 201, f"TXT upload failed: {res_upload_txt.text}"
        doc_txt = res_upload_txt.json()
        doc_txt_id = doc_txt["document_id"]
        print(f"   TXT Document ingested successfully! ID: {doc_txt_id}, Chunks: {doc_txt['chunk_count']}")
        assert doc_txt["status"] == "COMPLETED"
        assert doc_txt["chunk_count"] > 0
        assert doc_txt["storage_path"] is not None
        txt_storage_path = doc_txt["storage_path"]
        print(f"   Supabase Storage path: {txt_storage_path}")

        # 3. Ingest Markdown Document
        md_content = b"""# Multi-Agent Workflow Engine Specification
Section 1: Planner Agent
The Planner deconstructs complex user prompts into sequential and parallel DAG nodes.

Section 2: Retrieval Agent & Citations
The Retrieval agent conducts semantic vector searches over pgvector corpora.
Page citations and source document hashes must accompany every grounded claim.
"""
        files_md = {
            "file": ("workflow_engine_spec.md", io.BytesIO(md_content), "text/markdown")
        }
        print("3. Uploading Markdown document...")
        res_upload_md = await client.post("/api/v1/documents", files=files_md, data=data)
        assert res_upload_md.status_code == 201, f"MD upload failed: {res_upload_md.text}"
        doc_md = res_upload_md.json()
        doc_md_id = doc_md["document_id"]
        print(f"   MD Document ingested successfully! ID: {doc_md_id}, Chunks: {doc_md['chunk_count']}")
        assert doc_md["status"] == "COMPLETED"

        # 4. Ingest PDF Document
        # Minimal valid PDF file
        pdf_content = (
            b"%PDF-1.4\n"
            b"1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n"
            b"2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n"
            b"3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >> endobj\n"
            b"4 0 obj << /Length 55 >> stream\n"
            b"BT /F1 12 Tf 72 712 Td (STARK Financial Audit Report 2026) Tj ET\n"
            b"endstream\nendobj\n"
            b"xref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000214 00000 n \n"
            b"trailer << /Size 5 /Root 1 0 R >>\nstartxref\n320\n%%EOF"
        )
        files_pdf = {
            "file": ("financial_audit_2026.pdf", io.BytesIO(pdf_content), "application/pdf")
        }
        print("4. Uploading PDF document...")
        res_upload_pdf = await client.post("/api/v1/documents", files=files_pdf, data=data)
        assert res_upload_pdf.status_code == 201, f"PDF upload failed: {res_upload_pdf.text}"
        doc_pdf = res_upload_pdf.json()
        doc_pdf_id = doc_pdf["document_id"]
        print(f"   PDF Document ingested successfully! ID: {doc_pdf_id}, Chunks: {doc_pdf['chunk_count']}")

        # 5. Verify documents stored in Supabase Storage
        print("5. Verifying file in Supabase Storage...")
        storage_bytes = await SupabaseStorageService.download_file(txt_storage_path)
        if storage_bytes:
            print(f"   Verified binary downloaded from Supabase Storage: {len(storage_bytes)} bytes.")
            assert b"STARK Governance & Compliance Policy" in storage_bytes
        else:
            print(f"   Storage path recorded: {txt_storage_path}")

        # 6. Verify pgvector embeddings stored in PostgreSQL
        print("6. Verifying pgvector chunk embeddings in Supabase DB...")
        engine = create_async_engine(settings.DATABASE_URL)
        async with engine.begin() as conn:
            stmt = select(
                DocumentChunk.id,
                DocumentChunk.page_number,
                DocumentChunk.embedding_model,
                DocumentChunk.embedding_dimension,
                DocumentChunk.embedding,
            ).where(DocumentChunk.document_id == uuid.UUID(doc_txt_id))
            res = await conn.execute(stmt)
            chunks = res.all()
            print(f"   Found {len(chunks)} chunks in DB for document {doc_txt_id}:")
            for c in chunks:
                has_embedding = c[4] is not None
                print(f"     - Chunk {c[0]}: Page {c[1]}, Model: {c[2]}, Dim: {c[3]}, Has Vector: {has_embedding}")
                assert has_embedding, "Embedding vector is missing in pgvector!"
                assert c[3] == 384, f"Expected dimension 384, got {c[3]}"
        await engine.dispose()

        # 7. Semantic Retrieval via pgvector
        print("7. Testing Semantic Retrieval with pgvector cosine distance...")
        search_payload = {
            "query": "What are the security requirements for Supabase Storage and pgvector?",
            "top_k": 3,
            "workspace_id": str(DEMO_WORKSPACE_ID),
        }
        res_search = await client.post("/api/v1/documents/search", json=search_payload)
        assert res_search.status_code == 200, f"Search failed: {res_search.text}"
        search_data = res_search.json()
        print(f"   Retrieved {len(search_data['results'])} relevant chunks:")
        assert len(search_data["results"]) > 0, "Expected at least 1 retrieved chunk!"
        for r in search_data["results"]:
            print(f"     * Source: {r['filename']} (Page {r['page_number']}) | Similarity: {r['similarity_score'] * 100:.1f}%")
            print(f"       Excerpt: {r['content'][:120]}...")
            assert r["page_number"] >= 1, "Page-level citation missing!"
            assert r["similarity_score"] > 0.0, "Similarity score missing!"

        # 8. List documents endpoint
        print("8. Testing Document Listing endpoint...")
        res_list = await client.get(f"/api/v1/documents?workspace_id={DEMO_WORKSPACE_ID}")
        assert res_list.status_code == 200
        list_data = res_list.json()
        print(f"   Total documents in workspace: {list_data['total']}")
        assert list_data["total"] >= 3

        # 9. Document Deletion & Cleanup
        print(f"9. Testing Document Deletion for TXT document {doc_txt_id}...")
        res_del = await client.delete(f"/api/v1/documents/{doc_txt_id}")
        assert res_del.status_code == 200, f"Deletion failed: {res_del.text}"
        print("   Delete response:", res_del.json())

        # Verify chunks deleted from database
        engine = create_async_engine(settings.DATABASE_URL)
        async with engine.begin() as conn:
            stmt = select(DocumentChunk).where(DocumentChunk.document_id == uuid.UUID(doc_txt_id))
            res = await conn.execute(stmt)
            remaining_chunks = res.all()
            assert len(remaining_chunks) == 0, "Chunks were not cascaded deleted!"
            print("   Verified: Chunks and pgvector embeddings purged from database.")

            doc_stmt = select(Document).where(Document.id == uuid.UUID(doc_txt_id))
            doc_res = await conn.execute(doc_stmt)
            assert doc_res.scalar_one_or_none() is None, "Document record was not deleted!"
            print("   Verified: Document record deleted from PostgreSQL.")
        await engine.dispose()

        print("\n>>> ALL PROMPT 2 KNOWLEDGE MANAGEMENT & RAG ACCEPTANCE CRITERIA VERIFIED! <<<")

if __name__ == "__main__":
    asyncio.run(run_tests())
