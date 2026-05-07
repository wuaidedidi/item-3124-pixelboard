from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from app.models.models import MembershipPlan, User, Category, Tag, Material, MaterialTag, Board, BoardMaterial
from app.auth import hash_password, verify_password
from app.logger import logger


def seed_membership_plans(db: Session):
    if db.query(MembershipPlan).count() > 0:
        return

    plans = [
        MembershipPlan(
            name="free",
            name_zh="免费会员",
            price=0,
            duration_days=36500,
            max_downloads_per_day=5,
            max_uploads=20,
            can_download_original=False,
            storage_limit_mb=100,
            description="基础免费计划，适合浏览和收藏灵感素材",
            features=["每日5次下载", "最多20个上传", "标准画质下载", "100MB存储空间"],
            sort_order=0,
        ),
        MembershipPlan(
            name="pro",
            name_zh="专业会员",
            price=29.00,
            duration_days=30,
            max_downloads_per_day=50,
            max_uploads=500,
            can_download_original=True,
            storage_limit_mb=5120,
            description="专业创作者计划，解锁高清下载和更多上传空间",
            features=["每日50次下载", "最多500个上传", "原图画质下载", "5GB存储空间", "专属标识"],
            sort_order=1,
        ),
        MembershipPlan(
            name="premium",
            name_zh="尊享会员",
            price=59.00,
            duration_days=30,
            max_downloads_per_day=9999,
            max_uploads=9999,
            can_download_original=True,
            storage_limit_mb=51200,
            description="尊享无限计划，畅享所有素材资源无限制",
            features=["无限下载", "无限上传", "原图画质下载", "50GB存储空间", "专属标识", "优先客服支持", "抢先体验新功能"],
            sort_order=2,
        ),
    ]
    db.add_all(plans)
    db.commit()
    logger.info("Membership plans seeded")


def seed_admin_user(db: Session):
    admin = db.query(User).filter(User.username == "admin").first()
    free_plan = db.query(MembershipPlan).filter(MembershipPlan.name == "free").first()

    if not admin:
        admin = User(
            username="admin",
            password_hash=hash_password("123456"),
            nickname="管理员",
            email="admin@pixelboard.com",
            role="admin",
            status="active",
            membership_plan_id=free_plan.id if free_plan else None,
            bio="PixelBoard 平台管理员",
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)
        logger.info("Admin user created: admin / 123456")
    else:
        if not verify_password("123456", admin.password_hash):
            admin.password_hash = hash_password("123456")
            db.commit()
            logger.info("Admin password reset to: 123456")

    demo = db.query(User).filter(User.username == "demo").first()
    if not demo:
        pro_plan = db.query(MembershipPlan).filter(MembershipPlan.name == "pro").first()
        demo = User(
            username="demo",
            password_hash=hash_password("demo123"),
            nickname="设计师小王",
            email="demo@pixelboard.com",
            role="user",
            status="active",
            membership_plan_id=pro_plan.id if pro_plan else None,
            membership_expires_at=datetime.utcnow() + timedelta(days=30),
            bio="热爱设计，分享灵感",
        )
        db.add(demo)
        db.commit()
        db.refresh(demo)
        logger.info("Demo user created: demo / demo123")

    creator = db.query(User).filter(User.username == "creator").first()
    if not creator:
        premium_plan = db.query(MembershipPlan).filter(MembershipPlan.name == "premium").first()
        creator = User(
            username="creator",
            password_hash=hash_password("creator123"),
            nickname="创意达人",
            email="creator@pixelboard.com",
            role="user",
            status="active",
            membership_plan_id=premium_plan.id if premium_plan else None,
            membership_expires_at=datetime.utcnow() + timedelta(days=90),
            bio="专业摄影师 & UI设计师",
        )
        db.add(creator)
        db.commit()
        db.refresh(creator)
        logger.info("Creator user created: creator / creator123")


def seed_categories(db: Session):
    if db.query(Category).count() > 0:
        return

    categories = [
        Category(name="人物插画", description="动漫角色、人物立绘、少女插画", cover_image="/uploads/seed/img_33.png", sort_order=1),
        Category(name="风景插画", description="自然风光、四季美景、唯美场景", cover_image="/uploads/seed/img_9.png", sort_order=2),
        Category(name="场景氛围", description="城市街景、室内场景、生活氛围", cover_image="/uploads/seed/img_15.png", sort_order=3),
        Category(name="奇幻梦境", description="魔法世界、星空宇宙、梦幻场景", cover_image="/uploads/seed/img_30.png", sort_order=4),
        Category(name="季节主题", description="春樱秋叶、夏日冬雪、四季物语", cover_image="/uploads/seed/img_42.png", sort_order=5),
        Category(name="壁纸素材", description="桌面壁纸、手机壁纸、创意背景", cover_image="/uploads/seed/img_44.png", sort_order=6),
        Category(name="暗色系", description="夜景、暗调、神秘氛围插画", cover_image="/uploads/seed/img_26.png", sort_order=7),
        Category(name="暖色系", description="日落、秋天、温暖色调插画", cover_image="/uploads/seed/img_41.png", sort_order=8),
    ]
    db.add_all(categories)
    db.commit()
    logger.info("Categories seeded")


def seed_tags(db: Session):
    if db.query(Tag).count() > 0:
        return

    tag_names = [
        "少女", "人物", "花丛", "樱花", "雪景", "星空", "夜景", "日落",
        "海边", "森林", "秋天", "田园", "城市", "雨天", "温暖", "清新",
        "梦幻", "唯美", "治愈", "孤独", "奇幻", "魔法", "暗色", "冷色调",
        "壁纸", "竖屏", "横屏", "氛围感", "复古", "自然",
        "水彩", "花卉", "植物", "手绘", "冬日", "松林", "阳光", "银河",
        "科幻", "未来", "霓虹", "科技", "抽象", "流体", "渐变", "质感",
        "黑金", "奢华", "海报", "室内", "家居", "极简", "雨夜", "赛博朋克",
        "油画", "玻璃", "折射", "光影", "像素", "游戏", "RPG", "图标",
        "等距", "3D", "规划", "微缩", "蘑菇", "童话", "画廊", "展览",
        "艺术", "现代", "溪流",
    ]
    tags = [Tag(name=n, usage_count=0) for n in tag_names]
    db.add_all(tags)
    db.commit()
    logger.info("Tags seeded")


def seed_materials(db: Session):
    if db.query(Material).count() > 0:
        return

    admin = db.query(User).filter(User.username == "admin").first()
    demo = db.query(User).filter(User.username == "demo").first()
    creator = db.query(User).filter(User.username == "creator").first()
    categories = db.query(Category).all()
    tags = db.query(Tag).all()

    if not admin or not categories:
        return

    users = [u for u in [admin, demo, creator] if u]
    import random
    random.seed(42)

    sample_materials = [
        {"title": "粉白水彩玫瑰", "desc": "粉色和白色的水彩手绘玫瑰花束，带有几支紫色薰衣草点缀，画风清新细腻", "w": 2048, "h": 2048, "cat": "人物插画", "tags": ["水彩", "花卉", "清新", "手绘"], "premium": False, "img": "img_19.png"},
        {"title": "秋林溪涧", "desc": "金红枫叶铺满林地，清澈溪流在晨光中闪耀，秋意浓烈", "w": 1773, "h": 2364, "cat": "季节主题", "tags": ["秋天", "森林", "溪流", "阳光", "自然"], "premium": False, "img": "img_31.png"},
        {"title": "水彩热带花叶", "desc": "线描与水彩结合的热带植物花束，龟背竹与粉黄花朵交织，清新自然", "w": 2048, "h": 2048, "cat": "季节主题", "tags": ["水彩", "植物", "花卉", "手绘", "清新"], "premium": True, "img": "img_28.png"},
        {"title": "霓虹雨夜街头", "desc": "赛博城市雨夜霓虹闪烁，跑车穿行在湿润街道，光影倒映迷离", "w": 2364, "h": 1773, "cat": "暗色系", "tags": ["赛博朋克", "雨夜", "霓虹", "城市", "夜景"], "premium": False, "img": "img_35.png"},
        {"title": "现代艺术画廊", "desc": "极简白盒画廊中陈列抽象画作，轨道灯营造安静观展氛围", "w": 1672, "h": 2508, "cat": "场景氛围", "tags": ["画廊", "展览", "艺术", "现代", "室内", "极简"], "premium": False, "img": "img_21.png"},
        {"title": "梦幻蘑菇森林", "desc": "阳光穿过林间薄雾，彩色蘑菇与微光漂浮点亮童话小径", "w": 1773, "h": 2364, "cat": "奇幻梦境", "tags": ["蘑菇", "童话", "梦幻", "奇幻", "森林"], "premium": False, "img": "img_30.png"},
        {"title": "晨光雪松湖畔", "desc": "冬日晨光穿过积雪松枝，静谧的冰湖与远山勾勒清透雪景", "w": 1773, "h": 2364, "cat": "季节主题", "tags": ["雪景", "冬日", "松林", "阳光", "自然"], "premium": True, "img": "img_42.png"},
        {"title": "银河星河群峰", "desc": "浩瀚银河铺满夜空，群峰剪影在地平线静默矗立", "w": 2364, "h": 1773, "cat": "风景插画", "tags": ["星空", "银河", "夜景", "自然", "壁纸"], "premium": True, "img": "img_27.png"},
        {"title": "量子能量核心", "desc": "科幻装置中央释放蓝紫能量束，霓虹面板与金属结构营造未来感", "w": 2730, "h": 1535, "cat": "壁纸素材", "tags": ["科幻", "未来", "霓虹", "科技", "壁纸"], "premium": False, "img": "img_39.png"},
        {"title": "紫蓝流体波纹", "desc": "柔滑半透明的紫蓝流体曲面起伏延展，光泽渐变如丝绸", "w": 2730, "h": 1535, "cat": "壁纸素材", "tags": ["抽象", "流体", "渐变", "质感", "壁纸"], "premium": False, "img": "img_25.png"},
        {"title": "黑金奢华礼盒海报", "desc": "黑金质感背景与精致礼盒，暖色聚光凸显高端与尊贵气息", "w": 1773, "h": 2364, "cat": "场景氛围", "tags": ["黑金", "奢华", "质感", "海报"], "premium": False, "img": "img_22.png"},
        {"title": "北欧阳光客厅", "desc": "简约木质家具与浅灰沙发，大片自然光营造温馨舒适的家居氛围", "w": 1773, "h": 2364, "cat": "场景氛围", "tags": ["室内", "家居", "阳光", "极简", "温暖"], "premium": False, "img": "img_15.png"},
        {"title": "金色海岸日落", "desc": "落日洒在海面与礁石上，浪花翻涌，海岸线泛着金色暖光", "w": 1773, "h": 2364, "cat": "风景插画", "tags": ["海边", "日落", "温暖", "自然"], "premium": False, "img": "img_9.png"},
        {"title": "蓝金流体纹理", "desc": "深蓝与金色流体交织，抽象大理石质感层层延展", "w": 2364, "h": 1773, "cat": "壁纸素材", "tags": ["抽象", "流体", "渐变", "质感", "壁纸"], "premium": True, "img": "img_17.png"},
        {"title": "赛博雨夜街区", "desc": "霓虹映照雨夜街道，飞行车穿梭在高楼之间，湿润路面映出光影", "w": 2508, "h": 1672, "cat": "暗色系", "tags": ["赛博朋克", "城市", "雨夜", "霓虹", "科幻"], "premium": False, "img": "img_26.png"},
        {"title": "油画暮色田园", "desc": "厚涂油画笔触描绘起伏草坡与红顶小屋，夕阳染红天空与湖畔", "w": 2730, "h": 1535, "cat": "风景插画", "tags": ["田园", "日落", "油画", "温暖", "唯美"], "premium": False, "img": "img_41.png"},
        {"title": "赛博霓虹夜城", "desc": "霓虹灯与高楼交错的雨夜街景，冷色光带勾勒未来都市轮廓", "w": 1773, "h": 2364, "cat": "暗色系", "tags": ["赛博朋克", "城市", "雨夜", "霓虹", "冷色调"], "premium": True, "img": "img_26.png"},
        {"title": "虹彩玻璃球", "desc": "透明玻璃球与棱镜在彩色光影中折射出迷幻虹彩", "w": 2730, "h": 1535, "cat": "壁纸素材", "tags": ["玻璃", "折射", "光影", "抽象", "质感"], "premium": False, "img": "img_40.png"},
        {"title": "像素RPG道具包", "desc": "复古像素风勇者角色与宝剑、药水、宝箱等游戏道具合集", "w": 1773, "h": 2364, "cat": "人物插画", "tags": ["像素", "游戏", "RPG", "复古", "图标"], "premium": False, "img": "img_8.png"},
        {"title": "等距城市规划", "desc": "等距视角的微缩城市街区，蓝黄建筑与绿化道路布局清晰", "w": 2730, "h": 1535, "cat": "场景氛围", "tags": ["等距", "3D", "城市", "规划", "微缩"], "premium": False, "img": "img_38.png"},
        {"title": "极简美术馆走廊", "desc": "纯白走廊与抽象画作相映，聚光灯勾勒静谧的观展空间", "w": 2364, "h": 1773, "cat": "场景氛围", "tags": ["画廊", "展览", "艺术", "现代", "室内", "极简"], "premium": False, "img": "img_21.png"},
    ]

    for i, item in enumerate(sample_materials):
        cat = next((c for c in categories if c.name == item["cat"]), categories[0])
        user = users[i % len(users)]

        m = Material(
            title=item["title"],
            description=item["desc"],
            image_url=f"/uploads/seed/{item['img']}",
            thumbnail_url=f"/uploads/seed/{item['img']}",
            width=item["w"],
            height=item["h"],
            file_size=random.randint(200000, 5000000),
            file_type="image/jpeg",
            user_id=user.id,
            category_id=cat.id,
            download_count=random.randint(10, 500),
            view_count=random.randint(100, 5000),
            like_count=random.randint(5, 300),
            collect_count=random.randint(2, 100),
            status="approved",
            is_premium=item["premium"],
            created_at=datetime.utcnow() - timedelta(days=random.randint(1, 60)),
        )
        db.add(m)
        db.commit()
        db.refresh(m)

        cat.material_count = (cat.material_count or 0) + 1

        for tag_name in item["tags"]:
            tag = next((t for t in tags if t.name == tag_name), None)
            if tag:
                mt = MaterialTag(material_id=m.id, tag_id=tag.id)
                db.add(mt)
                tag.usage_count = (tag.usage_count or 0) + 1

    db.commit()
    logger.info(f"Seeded {len(sample_materials)} materials")


def seed_boards(db: Session):
    if db.query(Board).count() > 0:
        return

    demo = db.query(User).filter(User.username == "demo").first()
    if not demo:
        return

    materials = db.query(Material).filter(Material.status == "approved").limit(10).all()

    boards = [
        Board(name="灵感收藏", description="日常设计灵感收集", user_id=demo.id, is_public=True),
        Board(name="项目参考", description="项目设计参考素材", user_id=demo.id, is_public=True),
    ]
    db.add_all(boards)
    db.commit()

    for board in boards:
        db.refresh(board)

    for i, m in enumerate(materials[:5]):
        bm = BoardMaterial(board_id=boards[0].id, material_id=m.id)
        db.add(bm)
        boards[0].material_count = i + 1
        if i == 0:
            boards[0].cover_image = m.thumbnail_url or m.image_url

    for i, m in enumerate(materials[5:8]):
        bm = BoardMaterial(board_id=boards[1].id, material_id=m.id)
        db.add(bm)
        boards[1].material_count = i + 1
        if i == 0:
            boards[1].cover_image = m.thumbnail_url or m.image_url

    db.commit()
    logger.info("Boards seeded")


def run_seed(db: Session):
    logger.info("Starting database seeding...")
    seed_membership_plans(db)
    seed_admin_user(db)
    seed_categories(db)
    seed_tags(db)
    seed_materials(db)
    seed_boards(db)
    logger.info("Database seeding completed")
