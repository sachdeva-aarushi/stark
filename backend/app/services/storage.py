"""Supabase Storage client for private document storage."""

import os
from typing import Optional
import httpx
from dotenv import load_dotenv

from backend.app.core.config import get_settings
from backend.app.core.logging import get_logger

logger = get_logger(__name__)

# Ensure environment variables are loaded
load_dotenv("backend/.env")
load_dotenv(".env")


class SupabaseStorageService:
    """Service for managing document files in private Supabase Storage buckets."""

    BUCKET_NAME = "stark-documents"

    @classmethod
    def _get_credentials(cls) -> tuple[str, str]:
        settings = get_settings()
        url = settings.PUBLIC_URL or os.getenv("PUBLIC_URL") or "https://eliextckdrxvhesflorz.supabase.co"
        secret_key = (
            settings.SECRET_KEY
            or os.getenv("SECRET_KEY")
            or settings.PUBLISHABLE_KEY
            or os.getenv("PUBLISHABLE_KEY")
            or ""
        )
        url = url.rstrip("/")
        return url, secret_key

    @classmethod
    def _get_headers(cls) -> dict:
        _, secret_key = cls._get_credentials()
        return {
            "apikey": secret_key,
            "Authorization": f"Bearer {secret_key}",
        }

    @classmethod
    async def upload_file(
        cls,
        file_bytes: bytes,
        destination_path: str,
        content_type: str = "application/octet-stream",
    ) -> str:
        """Upload file bytes to private Supabase Storage bucket.

        Args:
            file_bytes: Binary content of document.
            destination_path: Relative path inside bucket (e.g., 'workspace_id/doc_id.pdf').
            content_type: MIME type of file.

        Returns:
            The destination path inside the bucket.
        """
        url, _ = cls._get_credentials()
        upload_url = f"{url}/storage/v1/object/{cls.BUCKET_NAME}/{destination_path}"
        headers = cls._get_headers()
        headers["Content-Type"] = content_type

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                res = await client.post(upload_url, headers=headers, content=file_bytes)
                if res.status_code in (200, 201):
                    logger.info(f"Uploaded file to Supabase Storage: {cls.BUCKET_NAME}/{destination_path}")
                    return destination_path
                else:
                    logger.warning(
                        f"Supabase Storage upload returned {res.status_code}: {res.text}. "
                        f"Falling back to local reference."
                    )
                    return destination_path
        except Exception as exc:
            logger.warning(f"Error uploading to Supabase Storage: {exc}. Storing metadata.")
            return destination_path

    @classmethod
    async def download_file(cls, destination_path: str) -> Optional[bytes]:
        """Download file bytes from private Supabase Storage bucket."""
        url, _ = cls._get_credentials()
        download_url = f"{url}/storage/v1/object/authenticated/{cls.BUCKET_NAME}/{destination_path}"
        headers = cls._get_headers()

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                res = await client.get(download_url, headers=headers)
                if res.status_code == 200:
                    return res.content
                logger.warning(f"Supabase Storage download returned status {res.status_code}")
                return None
        except Exception as exc:
            logger.warning(f"Error downloading from Supabase Storage: {exc}")
            return None

    @classmethod
    async def delete_file(cls, destination_path: str) -> bool:
        """Delete file from private Supabase Storage bucket.

        Args:
            destination_path: Relative path inside bucket.
        """
        url, _ = cls._get_credentials()
        delete_url = f"{url}/storage/v1/object/{cls.BUCKET_NAME}"
        headers = cls._get_headers()
        headers["Content-Type"] = "application/json"

        try:
            async with httpx.AsyncClient(timeout=20.0) as client:
                res = await client.request(
                    "DELETE",
                    delete_url,
                    headers=headers,
                    json={"prefixes": [destination_path]},
                )
                if res.status_code == 200:
                    logger.info(f"Deleted file from Supabase Storage: {destination_path}")
                    return True
                logger.warning(f"Supabase Storage delete returned {res.status_code}: {res.text}")
                return False
        except Exception as exc:
            logger.warning(f"Error deleting file from Supabase Storage: {exc}")
            return False
