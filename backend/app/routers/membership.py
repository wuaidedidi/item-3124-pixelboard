from datetime import datetime, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import MembershipPlan, User
from app.schemas.schemas import SubscribeMembershipRequest
from app.auth import get_current_user
from app.response import success_response, error_response
from app.logger import logger

router = APIRouter(prefix="/api/membership", tags=["会员"])


@router.get("/plans")
def list_plans(db: Session = Depends(get_db)):
    plans = db.query(MembershipPlan).filter(MembershipPlan.is_active == True).order_by(MembershipPlan.sort_order.asc()).all()
    result = [
        {
            "id": p.id,
            "name": p.name,
            "name_zh": p.name_zh,
            "price": float(p.price),
            "duration_days": p.duration_days,
            "max_downloads_per_day": p.max_downloads_per_day,
            "max_uploads": p.max_uploads,
            "can_download_original": p.can_download_original,
            "storage_limit_mb": p.storage_limit_mb,
            "description": p.description,
            "features": p.features,
        }
        for p in plans
    ]
    return success_response(result)


@router.post("/subscribe")
def subscribe(
    req: SubscribeMembershipRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    plan = db.query(MembershipPlan).filter(MembershipPlan.id == req.plan_id, MembershipPlan.is_active == True).first()
    if not plan:
        return error_response("会员计划不存在")

    if plan.name == "free":
        return error_response("无需订阅免费计划")

    now = datetime.utcnow()
    if current_user.membership_expires_at and current_user.membership_expires_at > now:
        new_expiry = current_user.membership_expires_at + timedelta(days=plan.duration_days)
    else:
        new_expiry = now + timedelta(days=plan.duration_days)

    current_user.membership_plan_id = plan.id
    current_user.membership_expires_at = new_expiry
    db.commit()

    logger.info(f"User {current_user.username} subscribed to {plan.name_zh}")
    return success_response(
        {
            "plan_name": plan.name_zh,
            "expires_at": str(new_expiry),
        },
        f"成功订阅{plan.name_zh}",
    )


@router.get("/my")
def my_membership(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    plan = current_user.membership_plan
    if not plan:
        return success_response({
            "plan": None,
            "expires_at": None,
            "is_active": False,
        })

    now = datetime.utcnow()
    is_active = True
    if plan.name != "free" and current_user.membership_expires_at:
        is_active = current_user.membership_expires_at > now

    return success_response({
        "plan": {
            "id": plan.id,
            "name": plan.name,
            "name_zh": plan.name_zh,
            "max_downloads_per_day": plan.max_downloads_per_day,
            "max_uploads": plan.max_uploads,
            "can_download_original": plan.can_download_original,
        },
        "expires_at": str(current_user.membership_expires_at) if current_user.membership_expires_at else None,
        "is_active": is_active,
        "download_count_today": current_user.download_count_today or 0,
    })
