import os
import sqlite3

from flask import current_app


def get_db_path() -> str:
    configured = os.environ.get("SQLITE_DB_PATH")
    if configured:
        return configured
    return os.path.join(current_app.root_path, "money_app.db")


def get_db_connection():
    conn = sqlite3.connect(get_db_path())
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn
