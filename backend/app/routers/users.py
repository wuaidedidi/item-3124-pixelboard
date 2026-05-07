from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
import os
import uuid

from app.database import get_db
from app.models.models import User, Material, Board, Like
from app.schemas.schemas import UserUpdateRequest, ChangePasswordRequest
from app.auth import get_current_user, hash_password, verify_password
from app.response import success_response, error_response
from app.config import settings
from app.logger import logger

router = APIRouter(prefix="/api/users", tags=["用户"])


@router.put("/profile")
def update_profile(
    req: UserUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if req.nickname is not None:
        current_user.nickname = req.nickname
    if req.bio is not None:
        current_user.bio = req.bio
    if req.avatar is not None:
        current_user.avatar = req.avatar

    if req.email is not None:
        if req.email and req.email != current_user.email:
            exists = db.query(User).filter(User.email == req.email, User.id != current_user.id).first()
            if exists:
                return error_response("该邮箱已被使用")
        current_user.email = req.email if req.email else None

    if req.phone is not None:
        if req.phone and req.phone != current_user.phone:
            exists = db.query(User).filter(User.phone == req.phone, User.id != current_user.id).first()
            if exists:
                return error_response("该手机号已被使用")
        current_user.phone = req.phone if req.phone else None

    db.commit()
    db.refresh(current_user)

    plan_name = None
    if current_user.membership_plan:
        plan_name = current_user.membership_plan.name_zh

    logger.info(f"User profile updated: {current_user.username}")
    return success_response(
        {
            "id": current_user.id,
            "username": current_user.username,
            "nickname": current_user.nickname,
            "email": current_user.email,
            "phone": current_user.phone,
            "avatar": current_user.avatar,
            "bio": current_user.bio,
            "role": current_user.role,
            "status": current_user.status,
            "membership_plan_id": current_user.membership_plan_id,
            "membership_plan_name": plan_name,
            "membership_expires_at": str(current_user.membership_expires_at) if current_user.membership_expires_at else None,
            "created_at": str(current_user.created_at) if current_user.created_at else None,
        },
        "个人信息更新成功",
    )


@router.put("/password")
def change_password(
    req: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not verify_password(req.old_password, current_user.password_hash):
        return error_response("原密码不正确")

    current_user.password_hash = hash_password(req.new_password)
    db.commit()

    logger.info(f"User password changed: {current_user.username}")
    return success_response(message="密码修改成功")


@router.post("/avatar")
def upload_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    allowed_types = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if file.content_type not in allowed_types:
        return error_response("仅支持 JPG、PNG、GIF、WebP 格式的图片")

    ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    filename = f"avatars/{uuid.uuid4().hex}.{ext}"
    filepath = os.path.join(settings.UPLOAD_DIR, filename)

    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, "wb") as f:
        content = file.file.read()
        if len(content) > 5 * 1024 * 1024:
            return error_response("头像文件大小不能超过 5MB")
        f.write(content)

    current_user.avatar = f"/uploads/{filename}"
    db.commit()

    logger.info(f"User avatar updated: {current_user.username}")
    return success_response({"avatar": current_user.avatar}, "头像上传成功")


@router.get("/{user_id}")
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return error_response("用户不存在")

    material_count = db.query(Material).filter(Material.user_id == user_id, Material.status == "approved").count()
    board_count = db.query(Board).filter(Board.user_id == user_id, Board.is_public == True).count()
    like_count = db.query(Like).filter(Like.user_id == user_id).count()

    plan_name = None
    if user.membership_plan:
        plan_name = user.membership_plan.name_zh

    return success_response({
        "id": user.id,
        "username": user.username,
        "nickname": user.nickname or user.username,
        "avatar": user.avatar,
        "bio": user.bio,
        "role": user.role,
        "membership_plan_name": plan_name,
        "material_count": material_count,
        "board_count": board_count,
        "like_count": like_count,
        "created_at": str(user.created_at) if user.created_at else None,
    })


@router.get("/{user_id}/materials")
def get_user_materials(
    user_id: int,
    page: int = 1,
    page_size: int = 20,
    db: Session = Depends(get_db),
):
    query = db.query(Material).filter(Material.user_id == user_id, Material.status == "approved")
    total = query.count()
    items = query.order_by(Material.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()

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
            "view_count": m.view_count,
            "created_at": str(m.created_at) if m.created_at else None,
        })

    return success_response({
        "items": result,
        "total": total,
        "page": page,
        "page_size": page_size,
    })


@router.get("/{user_id}/boards")
def get_user_boards(user_id: int, db: Session = Depends(get_db)):
    boards = db.query(Board).filter(Board.user_id == user_id, Board.is_public == True).all()
    result = []
    for b in boards:
        result.append({
            "id": b.id,
            "name": b.name,
            "description": b.description,
            "cover_image": b.cover_image,
            "material_count": b.material_count,
            "created_at": str(b.created_at) if b.created_at else None,
        })
    return success_response(result)
