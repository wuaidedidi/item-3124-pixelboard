import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DB_ENGINE: str = os.getenv("DB_ENGINE", "sqlite")
    DB_HOST: str = os.getenv("DB_HOST", "localhost")
    DB_PORT: int = int(os.getenv("DB_PORT", "3306"))
    DB_USER: str = os.getenv("DB_USER", "root")
    DB_PASSWORD: str = os.getenv("DB_PASSWORD", "root")
    DB_NAME: str = os.getenv("DB_NAME", "pixelboard")
    SQLITE_PATH: str = os.getenv("SQLITE_PATH", "/app/data/pixelboard.db")

    JWT_SECRET: str = os.getenv("JWT_SECRET", "pixelboard_jwt_secret_key_2024_production")
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_HOURS: int = 24

    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads"))
    MAX_FILE_SIZE: int = 20 * 1024 * 1024  # 20MB

    @property
    def DATABASE_URL(self) -> str:
        database_url = os.getenv("DATABASE_URL")
        if database_url:
            return database_url

        if self.DB_ENGINE.lower() == "mysql":
            return (
                f"mysql+pymysql://{self.DB_USER}:{self.DB_PASSWORD}"
                f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
                f"?charset=utf8mb4"
            )

        return (
            f"sqlite:///{self.SQLITE_PATH}"
        )

    class Config:
        env_file = ".env"


settings = Settings()
