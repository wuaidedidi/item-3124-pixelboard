import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from pydantic import ValidationError

from app.config import settings
from app.database import Base, engine, SessionLocal
from app.logger import logger
from app.seed import run_seed

from app.routers import auth, users, materials, boards, categories, membership, admin


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("PixelBoard application starting...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created/verified")

    db = SessionLocal()
    try:
        run_seed(db)
    except Exception as e:
        logger.error(f"Seed error: {e}")
    finally:
        db.close()

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    logger.info("PixelBoard application started successfully")
    yield
    logger.info("PixelBoard application shutting down...")


app = FastAPI(
    title="PixelBoard API",
    description="Pinterest-like creative material sharing platform",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(ValidationError)
async def validation_exception_handler(request: Request, exc: ValidationError):
    errors = exc.errors()
    if errors:
        first_error = errors[0]
        msg = first_error.get("msg", "请求参数验证失败")
        if "ctx" in first_error and "error" in first_error["ctx"]:
            msg = str(first_error["ctx"]["error"])
    else:
        msg = "请求参数验证失败"
    return JSONResponse(
        status_code=200,
        content={"code": 400, "message": msg, "data": None},
    )


@app.exception_handler(RequestValidationError)
async def request_validation_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    if errors:
        first = errors[0]
        field = " -> ".join(str(loc) for loc in first.get("loc", []) if loc != "body")
        msg = first.get("msg", "参数验证失败")
        message = f"{field}: {msg}" if field else msg
    else:
        message = "请求参数格式错误"
    return JSONResponse(
        status_code=200,
        content={"code": 400, "message": message, "data": None},
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {type(exc).__name__}: {exc}")
    return JSONResponse(
        status_code=200,
        content={"code": 500, "message": "服务器内部错误，请稍后重试", "data": None},
    )


os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(materials.router)
app.include_router(boards.router)
app.include_router(categories.router)
app.include_router(membership.router)
app.include_router(admin.router)


@app.get("/api/health")
def health_check():
    return {"code": 200, "message": "ok", "data": {"status": "healthy"}}
