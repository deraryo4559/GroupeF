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

# --- 3. requests テーブルを作成するSQL文 ---
create_payment_requests_table_sql = """
CREATE TABLE IF NOT EXISTS payment_requests (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    token             TEXT UNIQUE NOT NULL,                 -- 請求リンク識別子
    requester_user_id INTEGER NOT NULL,                     -- users.user_id を参照
    payment_user_id INTEGER NOT NULL,                     -- users.user_id を参照
    amount            INTEGER NOT NULL CHECK (amount BETWEEN 1 AND 50000),
    message           TEXT,
    status            TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','success','canceled')),
    created_at        TEXT NOT NULL DEFAULT (DATETIME('now','localtime')),
    expires_at        TEXT,
    FOREIGN KEY (requester_user_id) REFERENCES users(user_id)
);
"""
cursor.execute(create_payment_requests_table_sql)
print("'payment_requests' テーブルが正常に作成されました。")

# --- 4. transactions テーブルを作成するSQL文 ---
create_transactions_table_sql = """
CREATE TABLE IF NOT EXISTS transactions (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,       -- 取引を一意に特定するID
    sender_account_id   INTEGER NOT NULL,                     -- 送金元口座ID (accounts.id を参照)
    receiver_account_id INTEGER,                              -- 送金先口座ID (accounts.id を参照)
    amount           DECIMAL NOT NULL,                        -- 取引金額
    currency         VARCHAR(3) NOT NULL DEFAULT 'JPY',       -- 通貨コード
    message          TEXT,                                    -- 任意のメッセージ
    status           TEXT NOT NULL DEFAULT 'pending'
                       CHECK (status IN ('pending','completed','failed')),
    transaction_type TEXT NOT NULL
                       CHECK (transaction_type IN ('transfer','deposit','withdrawal')),
    created_at       TEXT NOT NULL DEFAULT (DATETIME('now','localtime')),
    FOREIGN KEY (sender_account_id) REFERENCES accounts(id),
    FOREIGN KEY (receiver_account_id) REFERENCES accounts(id)
);
"""
cursor.execute(create_transactions_table_sql)
print("'transactions' テーブルが正常に作成されました。")

# --- 5. transactions テーブルを作成するSQL文 ---
create_payment_requests_column_sql = """
    ALTER TABLE payment_requests ADD COLUMN payment_user_id INTEGER;
"""
cursor.execute(create_payment_requests_column_sql)
print("payment_requests_columnが正常に作成されました。")


# データベースへの変更を確定（保存）します
connection.commit()

# 接続を閉じます
connection.close()

