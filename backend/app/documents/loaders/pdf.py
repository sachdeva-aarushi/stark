"""Loader for PDF documents using PyMuPDF with pypdf fallback."""

from pathlib import Path
from typing import List

from backend.app.documents.loaders.base import BaseLoader, DocumentPage


class PDFLoader(BaseLoader):
    """Extracts text page-by-page from PDF files using PyMuPDF or pypdf."""

    def load(self, file_path: Path) -> List[DocumentPage]:
        if not file_path.exists():
            raise FileNotFoundError(f"PDF file not found: {file_path}")

        # Try fitz / pymupdf first
        try:
            import fitz  # PyMuPDF
            doc = fitz.open(str(file_path))
            if doc.is_encrypted:
                doc.close()
                raise ValueError("Encrypted or password-protected PDFs are not supported.")

            pages: List[DocumentPage] = []
            try:
                for page_idx in range(len(doc)):
                    page = doc.load_page(page_idx)
                    text = page.get_text("text") or ""
                    pages.append(DocumentPage(page_number=page_idx + 1, text=text))
            finally:
                doc.close()

            if not pages:
                pages.append(DocumentPage(page_number=1, text=""))
            return pages
        except Exception:
            # Fall back to pure-Python pypdf
            pass

        try:
            import pypdf
            reader = pypdf.PdfReader(str(file_path))
            if reader.is_encrypted:
                raise ValueError("Encrypted or password-protected PDFs are not supported.")

            pages: List[DocumentPage] = []
            for page_idx, page in enumerate(reader.pages):
                text = page.extract_text() or ""
                pages.append(DocumentPage(page_number=page_idx + 1, text=text))

            if not pages:
                pages.append(DocumentPage(page_number=1, text=""))
            return pages
        except Exception as exc:
            raise ValueError(f"Failed to extract text from PDF: {exc}") from exc
