from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, field_validator
import re


class LoginRequest(BaseModel):
    username: str = Field(..., min_length=2, max_length=50)
    password: str = Field(..., min_length=6, max_length=100)


class RegisterRequest(BaseModel):
    username: str = Field(..., min_length=2, max_length=50)
    password: str = Field(..., min_length=6, max_length=100)
    email: Optional[str] = None
    phone: Optional[str] = None
    nickname: Optional[str] = None

    @field_validator("email")
    @classmethod
    def validate_email(cls, v):
        if v is not None and v != "":
            pattern = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
            if not re.match(pattern, v):
                raise ValueError("邮箱格式不正确")
        return v if v != "" else None

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v):
        if v is not None and v != "":
            pattern = r"^1[3-9]\d{9}$"
            if not re.match(pattern, v):
                raise ValueError("手机号格式不正确")
        return v if v != "" else None


class UserResponse(BaseModel):
    id: int
    username: str
    email: Optional[str] = None
    phone: Optional[str] = None
    nickname: Optional[str] = None
    avatar: Optional[str] = None
    bio: Optional[str] = None
    role: str
    status: str
    membership_plan_id: Optional[int] = None
    membership_plan_name: Optional[str] = None
    membership_expires_at: Optional[datetime] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class UserUpdateRequest(BaseModel):
    nickname: Optional[str] = Field(None, max_length=50)
    email: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    avatar: Optional[str] = None

    @field_validator("email")
    @classmethod
    def validate_email(cls, v):
        if v is not None and v != "":
            pattern = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
            if not re.match(pattern, v):
                raise ValueError("邮箱格式不正确")
        return v if v != "" else None

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v):
        if v is not None and v != "":
            pattern = r"^1[3-9]\d{9}$"
            if not re.match(pattern, v):
                raise ValueError("手机号格式不正确")
        return v if v != "" else None


class ChangePasswordRequest(BaseModel):
    old_password: str = Field(..., min_length=6, max_length=100)
    new_password: str = Field(..., min_length=6, max_length=100)


class MembershipPlanResponse(BaseModel):
    id: int
    name: str
    name_zh: str
    price: float
    duration_days: int
    max_downloads_per_day: int
    max_uploads: int
    can_download_original: bool
    storage_limit_mb: int
    description: Optional[str] = None
    features: Optional[list] = None
    sort_order: int = 0
    is_active: bool = True

    class Config:
        from_attributes = True


class CategoryResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    cover_image: Optional[str] = None
    sort_order: int = 0
    material_count: int = 0

    class Config:
        from_attributes = True


class CategoryCreateRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    cover_image: Optional[str] = None
    sort_order: int = 0


class TagResponse(BaseModel):
    id: int
    name: str
    usage_count: int = 0

    class Config:
        from_attributes = True


class MaterialResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    image_url: str
    thumbnail_url: Optional[str] = None
    width: Optional[int] = None
    height: Optional[int] = None
    file_size: Optional[int] = None
    file_type: Optional[str] = None
    user_id: int
    category_id: Optional[int] = None
    download_count: int = 0
    view_count: int = 0
    like_count: int = 0
    collect_count: int = 0
    status: str = "approved"
    is_premium: bool = False
    created_at: Optional[datetime] = None
    user: Optional[UserResponse] = None
    category: Optional[CategoryResponse] = None
    tags: Optional[List[TagResponse]] = []
    is_liked: bool = False
    is_collected: bool = False

    class Config:
        from_attributes = True


class MaterialCreateRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    category_id: Optional[int] = None
    tags: Optional[str] = None
    is_premium: bool = False


class BoardResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    cover_image: Optional[str] = None
    user_id: int
    is_public: bool = True
    material_count: int = 0
    created_at: Optional[datetime] = None
    user: Optional[UserResponse] = None

    class Config:
        from_attributes = True


class BoardCreateRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    is_public: bool = True


class CommentResponse(BaseModel):
    id: int
    content: str
    user_id: int
    material_id: int
    parent_id: Optional[int] = None
    created_at: Optional[datetime] = None
    user: Optional[UserResponse] = None
    replies: Optional[List["CommentResponse"]] = []

    class Config:
        from_attributes = True


class CommentCreateRequest(BaseModel):
    content: str = Field(..., min_length=1, max_length=1000)
    parent_id: Optional[int] = None


class AdminUserUpdateRequest(BaseModel):
    role: Optional[str] = None
    status: Optional[str] = None
    membership_plan_id: Optional[int] = None


class SubscribeMembershipRequest(BaseModel):
    plan_id: int
