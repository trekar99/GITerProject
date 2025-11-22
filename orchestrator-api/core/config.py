import os
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    APP_NAME: str = "Gemini FastAPI Backend"
    GEMINI_API_KEY: str
    # En producción, cambia esto por la URL real de tu frontend (ej: "https://mi-web.com")
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:5173", "*"]

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()