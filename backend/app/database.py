import time
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

from app.config import settings
from app.logger import logger


def create_db_engine(max_retries: int = 30, retry_interval: int = 3):
    database_url = settings.DATABASE_URL
    connect_args = {}
    engine_options = {
        "pool_pre_ping": True,
        "echo": False,
    }

    if database_url.startswith("sqlite"):
        if database_url.startswith("sqlite:///"):
            db_path = database_url.replace("sqlite:///", "", 1)
            if db_path and db_path != ":memory:":
                import os
                db_dir = os.path.dirname(db_path)
                if db_dir:
                    os.makedirs(db_dir, exist_ok=True)
        connect_args["check_same_thread"] = False
    else:
        engine_options.update({"pool_size": 10, "max_overflow": 20})

    for attempt in range(1, max_retries + 1):
        try:
            engine = create_engine(
                database_url,
                connect_args=connect_args,
                **engine_options,
            )
            with engine.connect() as conn:
                from sqlalchemy import text
                conn.execute(text("SELECT 1"))
            logger.info("Database connection established successfully")
            return engine
        except Exception as e:
            logger.warning(
                f"Database connection attempt {attempt}/{max_retries} failed: {e}"
            )
            if attempt < max_retries:
                time.sleep(retry_interval)
            else:
                logger.error("Failed to connect to database after all retries")
                raise


engine = create_db_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
