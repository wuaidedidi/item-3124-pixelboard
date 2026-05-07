#!/usr/bin/env python3
"""打包脚本：将项目打包为 zip，排除不需要的文件"""

import os
import zipfile

PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_NAME = os.path.basename(PROJECT_DIR)
OUTPUT_DIR = os.path.join(os.path.dirname(PROJECT_DIR), "交付产物")
OUTPUT_ZIP = os.path.join(OUTPUT_DIR, f"{PROJECT_NAME}.zip")

EXCLUDE_DIRS = {
    "node_modules",
    "venv",
    ".venv",
    "__pycache__",
    ".git",
    ".playwright-mcp",
    "docs",
    ".omc",
    ".windsurf",
    ".agent",
    ".cache",
    ".vscode",
    "dist",
    ".next",
}

EXCLUDE_FILES = {
    "result.md",
    "rule.md",
    "轨迹.md",
    "项目轨迹.md",
    "CLAUDE.md",
    "preview_seed.html",
    "pack.py",
    "nul",
    ".DS_Store",
    "Thumbs.db",
    ".gitignore",
}

EXCLUDE_EXTENSIONS = {
    ".log",
    ".pyc",
    ".pyo",
}


def should_exclude(rel_path, filename):
    parts = rel_path.replace("\\", "/").split("/")
    for part in parts:
        if part in EXCLUDE_DIRS:
            return True
    if filename in EXCLUDE_FILES:
        return True
    _, ext = os.path.splitext(filename)
    if ext.lower() in EXCLUDE_EXTENSIONS:
        return True
    return False


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    file_count = 0
    with zipfile.ZipFile(OUTPUT_ZIP, "w", zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(PROJECT_DIR):
            # 过滤目录，避免进入排除目录
            dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]

            for f in files:
                full_path = os.path.join(root, f)
                rel_path = os.path.relpath(full_path, PROJECT_DIR)

                if should_exclude(rel_path, f):
                    continue

                arcname = os.path.join(PROJECT_NAME, rel_path)
                zf.write(full_path, arcname)
                file_count += 1

    size_mb = os.path.getsize(OUTPUT_ZIP) / (1024 * 1024)
    print(f"打包完成: {OUTPUT_ZIP}")
    print(f"包含 {file_count} 个文件, 大小 {size_mb:.2f} MB")


if __name__ == "__main__":
    main()
