from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload
from typing import Optional

from app.database import get_db
from app.models.models import Board, BoardMaterial, Material, User
from app.schemas.schemas import BoardCreateRequest
from app.auth import get_current_user, get_optional_user
from app.response import success_response, error_response
from app.logger import logger

router = APIRouter(prefix="/api/boards", tags=["画板"])


@router.get("")
def list_my_boards(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    boards = db.query(Board).filter(Board.user_id == current_user.id).order_by(Board.created_at.desc()).all()
    result = []
    for b in boards:
        result.append({
            "id": b.id,
            "name": b.name,
            "description": b.description,
            "cover_image": b.cover_image,
            "is_public": b.is_public,
            "material_count": b.material_count,
            "created_at": str(b.created_at) if b.created_at else None,
        })
    return success_response(result)


@router.post("")
def create_board(
    req: BoardCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    board = Board(
        name=req.name,
        description=req.description,
        user_id=current_user.id,
        is_public=req.is_public,
    )
    db.add(board)
    db.commit()
    db.refresh(board)

    logger.info(f"Board created: {board.name} by {current_user.username}")
    return success_response({
        "id": board.id,
        "name": board.name,
    }, "画板创建成功")


@router.put("/{board_id}")
def update_board(
    board_id: int,
    req: BoardCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    board = db.query(Board).filter(Board.id == board_id, Board.user_id == current_user.id).first()
    if not board:
        return error_response("画板不存在")

    board.name = req.name
    if req.description is not None:
        board.description = req.description
    board.is_public = req.is_public
    db.commit()

    return success_response(message="画板更新成功")


@router.delete("/{board_id}")
def delete_board(
    board_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    board = db.query(Board).filter(Board.id == board_id, Board.user_id == current_user.id).first()
    if not board:
        return error_response("画板不存在")

    db.delete(board)
    db.commit()

    return success_response(message="画板删除成功")


@router.get("/{board_id}")
def get_board_detail(
    board_id: int,
    page: int = 1,
    page_size: int = 20,
    current_user=Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    board = db.query(Board).filter(Board.id == board_id).first()
    if not board:
        return error_response("画板不存在")

    if not board.is_public:
        if not current_user or current_user.id != board.user_id:
            return error_response("该画板为私密画板")

    bm_query = (
        db.query(BoardMaterial)
        .options(joinedload(BoardMaterial.material).joinedload(Material.user))
        .filter(BoardMaterial.board_id == board_id)
    )

    total = bm_query.count()
    items = bm_query.order_by(BoardMaterial.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()

    materials = []
    for bm in items:
        m = bm.material
        if m and m.status == "approved":
            materials.append({
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

    board_user = db.query(User).filter(User.id == board.user_id).first()

    return success_response({
        "id": board.id,
        "name": board.name,
        "description": board.description,
        "cover_image": board.cover_image,
        "is_public": board.is_public,
        "material_count": board.material_count,
        "created_at": str(board.created_at) if board.created_at else None,
        "user": {
            "id": board_user.id,
            "nickname": board_user.nickname or board_user.username,
            "avatar": board_user.avatar,
        } if board_user else None,
        "materials": {
            "items": materials,
            "total": total,
            "page": page,
            "page_size": page_size,
        },
    })


@router.post("/{board_id}/materials/{material_id}")
def add_material_to_board(
    board_id: int,
    material_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    board = db.query(Board).filter(Board.id == board_id, Board.user_id == current_user.id).first()
    if not board:
        return error_response("画板不存在")

    material = db.query(Material).filter(Material.id == material_id).first()
    if not material:
        return error_response("素材不存在")

    existing = db.query(BoardMaterial).filter(
        BoardMaterial.board_id == board_id,
        BoardMaterial.material_id == material_id,
    ).first()
    if existing:
        return error_response("该素材已在画板中")

    bm = BoardMaterial(board_id=board_id, material_id=material_id)
    db.add(bm)
    board.material_count = (board.material_count or 0) + 1
    material.collect_count = (material.collect_count or 0) + 1

    if not board.cover_image:
        board.cover_image = material.thumbnail_url or material.image_url

    db.commit()
    return success_response(message="已收藏到画板")


@router.delete("/{board_id}/materials/{material_id}")
def remove_material_from_board(
    board_id: int,
    material_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    board = db.query(Board).filter(Board.id == board_id, Board.user_id == current_user.id).first()
    if not board:
        return error_response("画板不存在")

    bm = db.query(BoardMaterial).filter(
        BoardMaterial.board_id == board_id,
        BoardMaterial.material_id == material_id,
    ).first()
    if not bm:
        return error_response("该素材不在画板中")

    material = db.query(Material).filter(Material.id == material_id).first()
    if material:
        material.collect_count = max(0, (material.collect_count or 0) - 1)

    db.delete(bm)
    board.material_count = max(0, (board.material_count or 0) - 1)
    db.commit()

    return success_response(message="已从画板移除")
