CREATE TABLE IF NOT EXISTS payment_requests (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  token             TEXT UNIQUE NOT NULL,     -- 請求リンク識別子（URLに載せる）
  requester_user_id INTEGER NOT NULL,         -- 請求者
  amount            INTEGER NOT NULL,         -- 1〜50000を想定
  message           TEXT,                     -- 任意メッセージ
  status            TEXT NOT NULL DEFAULT 'pending',  -- pending/success/canceled 等
  created_at        TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at        TEXT                       -- 任意。失効日時（使わなければNULL）
);