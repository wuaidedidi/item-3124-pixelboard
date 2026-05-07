from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import Category, Tag
from app.response import success_response
from app.logger import logger

router = APIRouter(prefix="/api/categories", tags=["分类"])


@router.get("")
def list_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).order_by(Category.sort_order.asc(), Category.id.asc()).all()
    result = [
        {
            "id": c.id,
            "name": c.name,
            "description": c.description,
            "cover_image": c.cover_image,
            "sort_order": c.sort_order,
            "material_count": c.material_count,
        }
        for c in categories
    ]
    return success_response(result)


@router.get("/tags")
def list_popular_tags(db: Session = Depends(get_db)):
    tags = db.query(Tag).order_by(Tag.usage_count.desc()).limit(30).all()
    result = [{"id": t.id, "name": t.name, "usage_count": t.usage_count} for t in tags]
    return success_response(result)
