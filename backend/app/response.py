from typing import Any, Optional
from fastapi.responses import JSONResponse


def success_response(data: Any = None, message: str = "操作成功") -> dict:
    return {
        "code": 200,
        "message": message,
        "data": data,
    }


def error_response(
    message: str = "操作失败",
    code: int = 400,
    status_code: int = 200,
) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content={
            "code": code,
            "message": message,
            "data": None,
        },
    )


def paginated_response(
    items: list,
    total: int,
    page: int,
    page_size: int,
    message: str = "查询成功",
) -> dict:
    return {
        "code": 200,
        "message": message,
        "data": {
            "items": items,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": (total + page_size - 1) // page_size if page_size > 0 else 0,
        },
    }
