from datetime import datetime, date
from sqlalchemy import (
    Column, Integer, String, Text, Boolean, DateTime, Date,
    ForeignKey, DECIMAL, Enum, UniqueConstraint, JSON,
)
from sqlalchemy.orm import relationship
from app.database import Base


class MembershipPlan(Base):
    __tablename__ = "membership_plans"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False, unique=True)
    name_zh = Column(String(50), nullable=False)
    price = Column(DECIMAL(10, 2), nullable=False, default=0)
    duration_days = Column(Integer, nullable=False, default=30)
    max_downloads_per_day = Column(Integer, nullable=False, default=5)
    max_uploads = Column(Integer, nullable=False, default=10)
    can_download_original = Column(Boolean, default=False)
    storage_limit_mb = Column(Integer, nullable=False, default=100)
    description = Column(Text)
    features = Column(JSON)
    sort_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    users = relationship("User", back_populates="membership_plan")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), nullable=False, unique=True, index=True)
    email = Column(String(100), unique=True, nullable=True)
    phone = Column(String(20), nullable=True)
    password_hash = Column(String(255), nullable=False)
    nickname = Column(String(50))
    avatar = Column(String(500))
    bio = Column(Text)
    role = Column(Enum("admin", "user", name="user_role"), default="user")
    status = Column(Enum("active", "disabled", name="user_status"), default="active")
    membership_plan_id = Column(Integer, ForeignKey("membership_plans.id"), nullable=True)
    membership_expires_at = Column(DateTime, nullable=True)
    download_count_today = Column(Integer, default=0)
    last_download_date = Column(Date, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    membership_plan = relationship("MembershipPlan", back_populates="users")
    materials = relationship("Material", back_populates="user", cascade="all, delete-orphan")
    boards = relationship("Board", back_populates="user", cascade="all, delete-orphan")
    likes = relationship("Like", back_populates="user", cascade="all, delete-orphan")
    downloads = relationship("Download", back_populates="user", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="user", cascade="all, delete-orphan")


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False, unique=True)
    description = Column(Text)
    cover_image = Column(String(500))
    sort_order = Column(Integer, default=0)
    material_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    materials = relationship("Material", back_populates="category")


class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False, unique=True)
    usage_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)


class MaterialTag(Base):
    __tablename__ = "material_tags"

    material_id = Column(Integer, ForeignKey("materials.id", ondelete="CASCADE"), primary_key=True)
    tag_id = Column(Integer, ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True)


class Material(Base):
    __tablename__ = "materials"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    image_url = Column(String(500), nullable=False)
    thumbnail_url = Column(String(500))
    original_filename = Column(String(255))
    width = Column(Integer)
    height = Column(Integer)
    file_size = Column(Integer)
    file_type = Column(String(50))
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    download_count = Column(Integer, default=0)
    view_count = Column(Integer, default=0)
    like_count = Column(Integer, default=0)
    collect_count = Column(Integer, default=0)
    status = Column(Enum("pending", "approved", "rejected", name="material_status"), default="approved")
    is_premium = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="materials")
    category = relationship("Category", back_populates="materials")
    tags = relationship("Tag", secondary="material_tags", lazy="joined")
    likes = relationship("Like", back_populates="material", cascade="all, delete-orphan")
    downloads = relationship("Download", back_populates="material", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="material", cascade="all, delete-orphan")
    board_materials = relationship("BoardMaterial", back_populates="material", cascade="all, delete-orphan")


class Board(Base):
    __tablename__ = "boards"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    cover_image = Column(String(500))
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    is_public = Column(Boolean, default=True)
    material_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="boards")
    board_materials = relationship("BoardMaterial", back_populates="board", cascade="all, delete-orphan")


class BoardMaterial(Base):
    __tablename__ = "board_materials"

    id = Column(Integer, primary_key=True, autoincrement=True)
    board_id = Column(Integer, ForeignKey("boards.id", ondelete="CASCADE"), nullable=False)
    material_id = Column(Integer, ForeignKey("materials.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (UniqueConstraint("board_id", "material_id", name="uq_board_material"),)

    board = relationship("Board", back_populates="board_materials")
    material = relationship("Material", back_populates="board_materials")


class Like(Base):
    __tablename__ = "likes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    material_id = Column(Integer, ForeignKey("materials.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (UniqueConstraint("user_id", "material_id", name="uq_user_material_like"),)

    user = relationship("User", back_populates="likes")
    material = relationship("Material", back_populates="likes")


class Download(Base):
    __tablename__ = "downloads"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    material_id = Column(Integer, ForeignKey("materials.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="downloads")
    material = relationship("Material", back_populates="downloads")


class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, autoincrement=True)
    content = Column(Text, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    material_id = Column(Integer, ForeignKey("materials.id", ondelete="CASCADE"), nullable=False)
    parent_id = Column(Integer, ForeignKey("comments.id", ondelete="CASCADE"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="comments")
    material = relationship("Material", back_populates="comments")
    parent = relationship("Comment", remote_side=[id], backref="replies")
