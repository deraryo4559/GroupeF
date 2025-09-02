import sqlite3

# データベースファイルに接続します
connection = sqlite3.connect('app/money_app.db')
cursor = connection.cursor()

# 外部キー制約を有効にするためのPRAGMA文（SQLiteで必要）
cursor.execute("PRAGMA foreign_keys = ON;")

# --- 1. users テーブルを作成するSQL文 (id -> user_id に変更) ---
create_user_table_sql = """
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    phone_number TEXT,
    avatar_path TEXT,
    created_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
    updated_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime'))
);
"""
cursor.execute(create_user_table_sql)
print("'users' テーブルが正常に作成されました。")


# --- 2. accounts テーブルを作成するSQL文 (参照先を user_id に変更) ---
create_accounts_table_sql = """
CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    account_number TEXT NOT NULL UNIQUE,
    balance INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
    updated_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);
"""
cursor.execute(create_accounts_table_sql)
print("'accounts' テーブルが正常に作成されました。")


# データベースへの変更を確定（保存）します
connection.commit()

# 接続を閉じます
connection.close()

