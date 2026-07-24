"""
Centralized app configuration.

Every other module reads settings from here (`from app.config import settings`)
rather than calling os.environ directly — one place to see every env var the
app depends on, and one place to change defaults.
"""
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # --- MongoDB ---
    mongo_uri: str
    mongo_db_name: str = "luxuz_consult"

    # --- Auth ---
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 1440
    admin_email: str
    admin_password_hash: str

    # --- Cloudflare R2 ---
    r2_account_id: str = ""
    r2_access_key_id: str = ""
    r2_secret_access_key: str = ""
    r2_bucket_name: str = "luxuz-consult-media"
    r2_public_base_url: str = ""

    # --- App ---
    frontend_origin: str = "http://localhost:3000"
    max_upload_mb: int = 10
    environment: str = "development"

    @property
    def frontend_origins(self) -> list[str]:
        """Splits FRONTEND_ORIGIN on commas so .env can list dev + prod
        origins together, e.g. FRONTEND_ORIGIN=http://localhost:3000,https://luxuzconsult.com"""
        return [o.strip() for o in self.frontend_origin.split(",") if o.strip()]

    @property
    def r2_endpoint_url(self) -> str:
        return f"https://{self.r2_account_id}.r2.cloudflarestorage.com"

    @property
    def is_production(self) -> bool:
        return self.environment.lower() == "production"


@lru_cache
def get_settings() -> Settings:
    """Cached so Settings() is only constructed/validated once per process."""
    return Settings()


settings = get_settings()
