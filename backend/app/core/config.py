"""
Core application configuration for KrishiPulse.
"""
import os
from pydantic import BaseModel


class Settings(BaseModel):
    PROJECT_NAME: str = "KrishiPulse Intelligence Engine"
    API_V1_STR: str = "/api"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./krishipulse.db")
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",  # Tilak's Vite Dev Server
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    IS_DEMO_MODE: bool = True


settings = Settings()
