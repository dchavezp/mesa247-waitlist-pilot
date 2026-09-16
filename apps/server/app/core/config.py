from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "mesa247-waitlist-api"
    # SQLite default for zero-setup local; swap to MySQL via DATABASE_URL (D8).
    database_url: str = "sqlite:///./mesa247.db"
    cors_origins: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ]
    # D20: per-group wait fallback while the restaurant has no seating history yet.
    default_minutes_per_group: int = 5
    # Defaults de dev: en producción JWT_SECRET/JWT_EXPIRE_MINUTES van en .env (D33).
    jwt_secret: str = "dev-secret-mesa247-cambiar-en-produccion"
    jwt_expire_minutes: int = 60


settings = Settings()