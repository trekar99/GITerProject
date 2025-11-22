from fastapi import Request
from fastapi.responses import JSONResponse

ALLOWED_EXTERNAL_METHODS = {"GET"}
LOCALHOSTS = {"127.0.0.1", "::1"}

async def restrict_methods_middleware(request: Request, call_next):
    client_ip = request.client.host
    method = request.method

    if method in ALLOWED_EXTERNAL_METHODS:
        return await call_next(request)

    if client_ip in LOCALHOSTS:
        return await call_next(request)

    return JSONResponse(
        status_code=403,
        content={"detail": f"Method {method} is restricted to localhost only."},
    )
