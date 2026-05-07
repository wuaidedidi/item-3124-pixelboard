from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional

from app.database import get_db
from app.models.models import User, Material, Category, Download, MembershipPlan, Like, Board
from app.schemas.schemas import AdminUserUpdateRequest, CategoryCreateRequest
from app.auth import require_admin
from app.response import success_response, error_response
from app.logger import logger

router = APIRouter(prefix="/api/admin", tags=["管理后台"])


@router.get("/dashboard")
def dashboard(admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    total_users = db.query(User).count()
    total_materials = db.query(Material).count()
    total_downloads = db.query(Download).count()
    total_likes = db.query(Like).count()
    pending_materials = db.query(Material).filter(Material.status == "pending").count()
    pro_users = db.query(User).join(MembershipPlan).filter(MembershipPlan.name != "free").count()

    recent_users = db.query(User).order_by(User.created_at.desc()).limit(5).all()
    recent_materials = db.query(Material).order_by(Material.created_at.desc()).limit(5).all()

    return success_response({
        "stats": {
            "total_users": total_users,
            "total_materials": total_materials,
            "total_downloads": total_downloads,
            "total_likes": total_likes,
            "pending_materials": pending_materials,
            "pro_users": pro_users,
        },
        "recent_users": [
            {
                "id": u.id,
                "username": u.username,
                "nickname": u.nickname,
                "avatar": u.avatar,
                "created_at": str(u.created_at) if u.created_at else None,
            }
            for u in recent_users
        ],
        "recent_materials": [
            {
                "id": m.id,
                "title": m.title,
                "thumbnail_url": m.thumbnail_url,
                "status": m.status,
                "created_at": str(m.created_at) if m.created_at else None,
            }
            for m in recent_materials
        ],
    })


@router.get("/users")
def list_users(
    page: int = 1,
    page_size: int = 20,
    keyword: Optional[str] = None,
    role: Optional[str] = None,
    status: Optional[str] = None,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    query = db.query(User)

    if keyword:
        query = query.filter(
            User.username.ilike(f"%{keyword}%") | User.nickname.ilike(f"%{keyword}%")
        )
    if role:
        query = query.filter(User.role == role)
    if status:
        query = query.filter(User.status == status)

    total = query.count()
    users = query.order_by(User.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()

    result = []
    for u in users:
        plan_name = u.membership_plan.name_zh if u.membership_plan else "免费会员"
        result.append({
            "id": u.id,
            "username": u.username,
            "nickname": u.nickname,
            "email": u.email,
            "phone": u.phone,
            "avatar": u.avatar,
            "role": u.role,
            "status": u.status,
            "membership_plan_name": plan_name,
            "created_at": str(u.created_at) if u.created_at else None,
        })

    return success_response({
        "items": result,
        "total": total,
        "page": page,
        "page_size": page_size,
    })


@router.put("/users/{user_id}")
def update_user(
    user_id: int,
    req: AdminUserUpdateRequest,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return error_response("用户不存在")

    if user.id == admin.id:
        if req.role and req.role != admin.role:
            return error_response("管理员不能修改自己的角色")
        if req.status and req.status == "disabled":
            return error_response("管理员不能禁用自己的账号")

    if req.role:
        user.role = req.role
    if req.status:
        user.status = req.status
    if req.membership_plan_id is not None:
        user.membership_plan_id = req.membership_plan_id

    db.commit()
    logger.info(f"Admin updated user {user.username}: role={req.role}, status={req.status}")
    return success_response(message="用户信息更新成功")


@router.get("/materials")
def list_materials(
    page: int = 1,
    page_size: int = 20,
    keyword: Optional[str] = None,
    status: Optional[str] = None,
    category_id: Optional[int] = None,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    query = db.query(Material)

    if keyword:
        query = query.filter(Material.title.ilike(f"%{keyword}%"))
    if status:
        query = query.filter(Material.status == status)
    if category_id:
        query = query.filter(Material.category_id == category_id)

    total = query.count()
    items = query.order_by(Material.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()

    result = []
    for m in items:
        user = db.query(User).filter(User.id == m.user_id).first()
        cat = db.query(Category).filter(Category.id == m.category_id).first() if m.category_id else None
        result.append({
            "id": m.id,
            "title": m.title,
            "image_url": m.image_url,
            "thumbnail_url": m.thumbnail_url,
            "status": m.status,
            "is_premium": m.is_premium,
            "download_count": m.download_count,
            "like_count": m.like_count,
            "view_count": m.view_count,
            "category_name": cat.name if cat else None,
            "user_nickname": user.nickname if user else None,
            "created_at": str(m.created_at) if m.created_at else None,
        })

    return success_response({
        "items": result,
        "total": total,
        "page": page,
        "page_size": page_size,
    })


@router.put("/materials/{material_id}/status")
def update_material_status(
    material_id: int,
    status: str,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    if status not in ["approved", "rejected", "pending"]:
        return error_response("无效的状态值")

    material = db.query(Material).filter(Material.id == material_id).first()
    if not material:
        return error_response("素材不存在")

    material.status = status
    db.commit()

    logger.info(f"Admin updated material {material_id} status to {status}")
    return success_response(message="素材状态更新成功")


@router.delete("/materials/{material_id}")
def delete_material(
    material_id: int,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    material = db.query(Material).filter(Material.id == material_id).first()
    if not material:
        return error_response("素材不存在")

    db.delete(material)
    db.commit()

    logger.info(f"Admin deleted material {material_id}")
    return success_response(message="素材删除成功")


@router.get("/categories")
def list_categories(admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    cats = db.query(Category).order_by(Category.sort_order.asc()).all()
    result = [
        {
            "id": c.id,
            "name": c.name,
            "description": c.description,
            "cover_image": c.cover_image,
            "sort_order": c.sort_order,
            "material_count": c.material_count,
        }
        for c in cats
    ]
    return success_response(result)


@router.post("/categories")
def create_category(
    req: CategoryCreateRequest,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    existing = db.query(Category).filter(Category.name == req.name).first()
    if existing:
        return error_response("该分类名称已存在")

    cat = Category(
        name=req.name,
        description=req.description,
        cover_image=req.cover_image,
        sort_order=req.sort_order,
    )
    db.add(cat)
    db.commit()

    logger.info(f"Admin created category: {cat.name}")
    return success_response({"id": cat.id}, "分类创建成功")


@router.put("/categories/{category_id}")
def update_category(
    category_id: int,
    req: CategoryCreateRequest,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        return error_response("分类不存在")

    dup = db.query(Category).filter(Category.name == req.name, Category.id != category_id).first()
    if dup:
        return error_response("该分类名称已存在")

    cat.name = req.name
    cat.description = req.description
    cat.cover_image = req.cover_image
    cat.sort_order = req.sort_order
    db.commit()

    return success_response(message="分类更新成功")


@router.delete("/categories/{category_id}")
def delete_category(
    category_id: int,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        return error_response("分类不存在")

    material_count = db.query(Material).filter(Material.category_id == category_id).count()
    if material_count > 0:
        return error_response(f"该分类下有 {material_count} 个素材，无法删除")

    db.delete(cat)
    db.commit()

    logger.info(f"Admin deleted category: {cat.name}")
    return success_response(message="分类删除成功")
