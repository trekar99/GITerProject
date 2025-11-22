from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import get_settings
from routes import llm

settings = get_settings()

app = FastAPI(title=settings.APP_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"], # Permite todos los métodos (GET, POST, OPTIONS, etc.)
    allow_headers=["*"], # Permite todos los headers
)

app.include_router(llm.router, prefix="/llm")

@app.get("/")
def health_check():
    return {"status": "ok", "message": "API encendida correctamente"}