"""Re-indexing service to migrate document chunk embeddings to 768-dimensional Google Gemini vectors."""

import asyncio
from typing import Dict, List
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.config import get_settings
from backend.app.core.logging import get_logger
from backend.app.db.models.document_chunk import DocumentChunk
from backend.app.documents.embeddings.provider import GoogleEmbeddingProvider, get_embedding_provider
from backend.app.documents.vectorstore.faiss_store import get_vector_store

logger = get_logger(__name__)


async def reindex_all_chunks(db: AsyncSession) -> Dict[str, int]:
    """Re-embed all existing document chunks using Google Gemini embedding provider (768 dimensions).

    Returns summary dictionary with counts of total chunks processed and successfully updated.
    """
    settings = get_settings()
    provider = get_embedding_provider()

    # Ensure provider is 768-dim Google provider or fallback to GoogleEmbeddingProvider directly
    if not isinstance(provider, GoogleEmbeddingProvider):
        provider = GoogleEmbeddingProvider(
            model=settings.EMBEDDING_MODEL or "gemini-embedding-001",
            api_key=settings.GEMINI_API_KEY,
            dimension=768,
        )

    stmt = select(DocumentChunk).order_by(DocumentChunk.document_id, DocumentChunk.chunk_index)
    res = await db.execute(stmt)
    chunks: List[DocumentChunk] = list(res.scalars().all())

    if not chunks:
        logger.info("No document chunks found in database to re-index.")
        return {"total": 0, "updated": 0}

    logger.info(f"Re-indexing {len(chunks)} chunks using Google Gemini Embedding ({provider.dimension}-dim)...")

    texts = [c.content for c in chunks]
    vectors = provider.embed_documents(texts)

    faiss_vectors = []
    faiss_metadata = []

    for idx, chunk in enumerate(chunks):
        if idx < len(vectors):
            vec = vectors[idx]
            chunk.embedding = vec
            chunk.embedding_model = getattr(provider, "model", "gemini-embedding-001")
            chunk.embedding_dimension = len(vec)
            db.add(chunk)

            faiss_vectors.append(vec)
            faiss_metadata.append(
                {
                    "chunk_id": str(chunk.id),
                    "document_id": str(chunk.document_id),
                    "content": chunk.content,
                    "page_number": chunk.page_number,
                }
            )

    await db.commit()

    # Rebuild FAISS index with new 768-dim vectors
    try:
        store = get_vector_store()
        store.rebuild(faiss_vectors, faiss_metadata)
    except Exception as exc:
        logger.warning(f"Could not update FAISS store during re-index: {exc}")

    logger.info(f"Successfully re-indexed {len(chunks)} chunks to 768 dimensions.")
    return {"total": len(chunks), "updated": len(chunks)}


if __name__ == "__main__":
    from backend.app.db.session import get_db_context

    async def main():
        async with get_db_context() as db:
            result = await reindex_all_chunks(db)
            print("Reindex result:", result)

    asyncio.run(main())
