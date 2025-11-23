from fastapi import Request
from fastapi.responses import JSONResponse

LOCALHOSTS = {"127.0.0.1", "::1"}
FRONTEND_ORIGINS = {
    "localhost:5173",
    "127.0.0.1:5173",
    "79.143.89.115:5173"
}

async def restrict_methods_middleware(request: Request, call_next):
    client_host = request.client.host
    origin = request.headers.get("origin", "")
    method = request.method

    # Permitir GET desde cualquier sitio
    if method == "GET":
        return await call_next(request)

    # Permitir POST solo desde el frontend
    if origin and any(o in origin for o in FRONTEND_ORIGINS):
        return await call_next(request)

    # Permitir métodos internos solo desde localhost (scripts internos)
    if client_host in LOCALHOSTS:
        return await call_next(request)

    return JSONResponse(
        status_code=403,
        content={"detail": f"Method {method} is restricted."},
    )

