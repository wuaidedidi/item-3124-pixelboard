from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import User, MembershipPlan
from app.schemas.schemas import LoginRequest, RegisterRequest, UserResponse
from app.auth import hash_password, verify_password, create_access_token, get_current_user
from app.response import success_response, error_response
from app.logger import logger

router = APIRouter(prefix="/api/auth", tags=["认证"])


@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == req.username).first()
    if not user:
        return error_response("用户名或密码错误")

    if not verify_password(req.password, user.password_hash):
        return error_response("用户名或密码错误")

    if user.status == "disabled":
        return error_response("账号已被禁用，请联系管理员")

    token = create_access_token({"user_id": user.id, "role": user.role})

    plan_name = None
    if user.membership_plan:
        plan_name = user.membership_plan.name_zh

    logger.info(f"User login success: {user.username}")
    return success_response(
        {
            "token": token,
            "user": {
                "id": user.id,
                "username": user.username,
                "nickname": user.nickname or user.username,
                "email": user.email,
                "phone": user.phone,
                "avatar": user.avatar,
                "bio": user.bio,
                "role": user.role,
                "status": user.status,
                "membership_plan_id": user.membership_plan_id,
                "membership_plan_name": plan_name,
                "membership_expires_at": str(user.membership_expires_at) if user.membership_expires_at else None,
                "created_at": str(user.created_at) if user.created_at else None,
            },
        },
        "登录成功",
    )


@router.post("/register")
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.username == req.username).first()
    if existing:
        return error_response("用户名已存在")

    if req.email:
        email_exists = db.query(User).filter(User.email == req.email).first()
        if email_exists:
            return error_response("该邮箱已被注册")

    free_plan = db.query(MembershipPlan).filter(MembershipPlan.name == "free").first()

    user = User(
        username=req.username,
        password_hash=hash_password(req.password),
        email=req.email,
        phone=req.phone,
        nickname=req.nickname or req.username,
        role="user",
        status="active",
        membership_plan_id=free_plan.id if free_plan else None,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"user_id": user.id, "role": user.role})

    logger.info(f"User registered: {user.username}")
    return success_response(
        {
            "token": token,
            "user": {
                "id": user.id,
                "username": user.username,
                "nickname": user.nickname,
                "email": user.email,
                "phone": user.phone,
                "avatar": user.avatar,
                "bio": user.bio,
                "role": user.role,
                "status": user.status,
                "membership_plan_id": user.membership_plan_id,
                "membership_plan_name": "免费会员",
                "membership_expires_at": None,
                "created_at": str(user.created_at) if user.created_at else None,
            },
        },
        "注册成功",
    )


@router.get("/me")
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    plan_name = None
    if current_user.membership_plan:
        plan_name = current_user.membership_plan.name_zh

    return success_response(
        {
            "id": current_user.id,
            "username": current_user.username,
            "nickname": current_user.nickname or current_user.username,
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
        }
    )
