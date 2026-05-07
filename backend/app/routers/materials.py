from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from typing import Optional
from datetime import date
import os
import uuid

from PIL import Image

from app.database import get_db
from app.models.models import Material, Tag, MaterialTag, Like, Download, Comment, User, BoardMaterial, Category
from app.schemas.schemas import CommentCreateRequest
from app.auth import get_current_user, get_optional_user
from app.response import success_response, error_response
from app.config import settings
from app.logger import logger

router = APIRouter(prefix="/api/materials", tags=["素材"])


def material_to_dict(m, current_user=None, db=None):
    user_data = None
    if m.user:
        user_data = {
            "id": m.user.id,
            "username": m.user.username,
            "nickname": m.user.nickname or m.user.username,
            "avatar": m.user.avatar,
        }

    category_data = None
    if m.category:
        category_data = {"id": m.category.id, "name": m.category.name}

    tags_data = [{"id": t.id, "name": t.name} for t in (m.tags or [])]

    is_liked = False
    is_collected = False
    if current_user and db:
        is_liked = db.query(Like).filter(Like.user_id == current_user.id, Like.material_id == m.id).first() is not None
        is_collected = db.query(BoardMaterial).join(
            BoardMaterial.board
        ).filter(
            BoardMaterial.material_id == m.id,
            BoardMaterial.board.has(user_id=current_user.id),
        ).first() is not None

    return {
        "id": m.id,
        "title": m.title,
        "description": m.description,
        "image_url": m.image_url,
        "thumbnail_url": m.thumbnail_url,
        "width": m.width,
        "height": m.height,
        "file_size": m.file_size,
        "file_type": m.file_type,
        "user_id": m.user_id,
        "category_id": m.category_id,
        "download_count": m.download_count,
        "view_count": m.view_count,
        "like_count": m.like_count,
        "collect_count": m.collect_count,
        "status": m.status,
        "is_premium": m.is_premium,
        "created_at": str(m.created_at) if m.created_at else None,
        "user": user_data,
        "category": category_data,
        "tags": tags_data,
        "is_liked": is_liked,
        "is_collected": is_collected,
    }


@router.get("")
def list_materials(
    page: int = 1,
    page_size: int = 20,
    category_id: Optional[int] = None,
    tag: Optional[str] = None,
    keyword: Optional[str] = None,
    sort: str = "default",
    current_user=Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    query = db.query(Material).options(
        joinedload(Material.user),
        joinedload(Material.category),
        joinedload(Material.tags),
    ).filter(Material.status == "approved")

    if category_id:
        query = query.filter(Material.category_id == category_id)

    if tag:
        query = query.join(Material.tags).filter(Tag.name == tag)

    if keyword:
        query = query.filter(
            Material.title.ilike(f"%{keyword}%") | Material.description.ilike(f"%{keyword}%")
        )

    total = query.count()

    if sort == "default":
        score = (
            func.coalesce(Material.like_count, 0) * 3
            + func.coalesce(Material.download_count, 0) * 2
            + func.coalesce(Material.view_count, 0)
        )
        query = query.order_by(score.desc(), Material.created_at.desc())
    elif sort == "popular":
        query = query.order_by(Material.like_count.desc(), Material.created_at.desc())
    elif sort == "downloads":
        query = query.order_by(Material.download_count.desc(), Material.created_at.desc())
    else:
        query = query.order_by(Material.created_at.desc())

    items = query.offset((page - 1) * page_size).limit(page_size).all()
    result = [material_to_dict(m, current_user, db) for m in items]

    return success_response({
        "items": result,
        "total": total,
        "page": page,
        "page_size": page_size,
    })


@router.get("/{material_id}")
def get_material(
    material_id: int,
    current_user=Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    m = db.query(Material).options(
        joinedload(Material.user),
        joinedload(Material.category),
        joinedload(Material.tags),
    ).filter(Material.id == material_id).first()

    if not m:
        return error_response("素材不存在")

    m.view_count = (m.view_count or 0) + 1
    db.commit()

    return success_response(material_to_dict(m, current_user, db))


@router.post("")
def upload_material(
    title: str = Form(...),
    description: Optional[str] = Form(None),
    category_id: Optional[int] = Form(None),
    tags: Optional[str] = Form(None),
    is_premium: bool = Form(False),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    allowed_types = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"]
    if file.content_type not in allowed_types:
        return error_response("仅支持 JPG、PNG、GIF、WebP、SVG 格式")

    content = file.file.read()
    if len(content) > settings.MAX_FILE_SIZE:
        return error_response("文件大小不能超过 20MB")

    ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    filename = f"materials/{uuid.uuid4().hex}.{ext}"
    filepath = os.path.join(settings.UPLOAD_DIR, filename)
    os.makedirs(os.path.dirname(filepath), exist_ok=True)

    with open(filepath, "wb") as f:
        f.write(content)

    width, height = None, None
    try:
        file.file.seek(0)
        with Image.open(filepath) as img:
            width, height = img.size
    except Exception:
        pass

    image_url = f"/uploads/{filename}"

    material = Material(
        title=title,
        description=description,
        image_url=image_url,
        thumbnail_url=image_url,
        original_filename=file.filename,
        width=width,
        height=height,
        file_size=len(content),
        file_type=file.content_type,
        user_id=current_user.id,
        category_id=category_id,
        is_premium=is_premium,
        status="approved",
    )
    db.add(material)
    db.commit()
    db.refresh(material)

    if tags:
        tag_names = [t.strip() for t in tags.split(",") if t.strip()]
        for tag_name in tag_names:
            tag_obj = db.query(Tag).filter(Tag.name == tag_name).first()
            if not tag_obj:
                tag_obj = Tag(name=tag_name)
                db.add(tag_obj)
                db.commit()
                db.refresh(tag_obj)
            tag_obj.usage_count = (tag_obj.usage_count or 0) + 1
            mt = MaterialTag(material_id=material.id, tag_id=tag_obj.id)
            db.add(mt)
        db.commit()

    if category_id:
        cat = db.query(Category).filter(Category.id == category_id).first()
        if cat:
            cat.material_count = (cat.material_count or 0) + 1
            db.commit()

    logger.info(f"Material uploaded: {material.title} by {current_user.username}")
    return success_response({"id": material.id}, "素材上传成功")


@router.post("/{material_id}/like")
def toggle_like(
    material_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    material = db.query(Material).filter(Material.id == material_id).first()
    if not material:
        return error_response("素材不存在")

    existing = db.query(Like).filter(
        Like.user_id == current_user.id, Like.material_id == material_id
    ).first()

    if existing:
        db.delete(existing)
        material.like_count = max(0, (material.like_count or 0) - 1)
        db.commit()
        return success_response({"liked": False, "like_count": material.like_count}, "已取消点赞")
    else:
        like = Like(user_id=current_user.id, material_id=material_id)
        db.add(like)
        material.like_count = (material.like_count or 0) + 1
        db.commit()
        return success_response({"liked": True, "like_count": material.like_count}, "点赞成功")


@router.post("/{material_id}/download")
def download_material(
    material_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    material = db.query(Material).filter(Material.id == material_id).first()
    if not material:
        return error_response("素材不存在")

    if material.is_premium and current_user.membership_plan:
        if current_user.membership_plan.name == "free":
            return error_response("该素材为会员专享，请升级会员后下载")

    plan = current_user.membership_plan
    if plan:
        today = date.today()
        if current_user.last_download_date != today:
            current_user.download_count_today = 0
            current_user.last_download_date = today

        if current_user.download_count_today >= plan.max_downloads_per_day:
            return error_response(f"今日下载次数已达上限（{plan.max_downloads_per_day}次），请明日再试或升级会员")

        current_user.download_count_today += 1

    download = Download(user_id=current_user.id, material_id=material_id)
    db.add(download)
    material.download_count = (material.download_count or 0) + 1
    db.commit()

    logger.info(f"Material downloaded: {material.title} by {current_user.username}")
    return success_response({"image_url": material.image_url}, "下载成功")


@router.get("/{material_id}/comments")
def get_comments(material_id: int, db: Session = Depends(get_db)):
    comments = (
        db.query(Comment)
        .options(joinedload(Comment.user))
        .filter(Comment.material_id == material_id, Comment.parent_id == None)
        .order_by(Comment.created_at.desc())
        .all()
    )

    def comment_to_dict(c):
        replies = (
            db.query(Comment)
            .options(joinedload(Comment.user))
            .filter(Comment.parent_id == c.id)
            .order_by(Comment.created_at.asc())
            .all()
        )
        return {
            "id": c.id,
            "content": c.content,
            "user_id": c.user_id,
            "material_id": c.material_id,
            "parent_id": c.parent_id,
            "created_at": str(c.created_at) if c.created_at else None,
            "user": {
                "id": c.user.id,
                "username": c.user.username,
                "nickname": c.user.nickname or c.user.username,
                "avatar": c.user.avatar,
            } if c.user else None,
            "replies": [comment_to_dict(r) for r in replies],
        }

    return success_response([comment_to_dict(c) for c in comments])


@router.post("/{material_id}/comments")
def create_comment(
    material_id: int,
    req: CommentCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    material = db.query(Material).filter(Material.id == material_id).first()
    if not material:
        return error_response("素材不存在")

    if req.parent_id:
        parent = db.query(Comment).filter(Comment.id == req.parent_id).first()
        if not parent:
            return error_response("回复的评论不存在")

    comment = Comment(
        content=req.content,
        user_id=current_user.id,
        material_id=material_id,
        parent_id=req.parent_id,
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)

    return success_response({
        "id": comment.id,
        "content": comment.content,
        "created_at": str(comment.created_at),
        "user": {
            "id": current_user.id,
            "username": current_user.username,
            "nickname": current_user.nickname or current_user.username,
            "avatar": current_user.avatar,
        },
    }, "评论发表成功")


@router.get("/{material_id}/related")
def get_related_materials(material_id: int, db: Session = Depends(get_db)):
    material = db.query(Material).filter(Material.id == material_id).first()
    if not material:
        return error_response("素材不存在")

    query = db.query(Material).options(
        joinedload(Material.user),
    ).filter(
        Material.id != material_id,
        Material.status == "approved",
    )

    if material.category_id:
        query = query.filter(Material.category_id == material.category_id)

    items = query.order_by(func.rand()).limit(8).all()

    result = []
    for m in items:
        result.append({
            "id": m.id,
            "title": m.title,
            "image_url": m.image_url,
            "thumbnail_url": m.thumbnail_url,
            "width": m.width,
            "height": m.height,
            "like_count": m.like_count,
            "user": {
                "id": m.user.id,
                "nickname": m.user.nickname or m.user.username,
                "avatar": m.user.avatar,
            } if m.user else None,
        })

    return success_response(result)
