# app/models/payment_request.py
import sqlite3
import uuid
from typing import Tuple, Optional

DB_PATH = 'app/money_app.db'

def get_db_connection():
    """データベース接続を取得するヘルパー関数"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def ensure_schema():
    """
    必要に応じて payment_user_id カラムを追加（起動時や最初の呼び出しで実行しても安全）
    """
    conn = get_db_connection()
    try:
        cols = [r[1] for r in conn.execute("PRAGMA table_info(payment_requests)").fetchall()]
        if "payment_user_id" not in cols:
            conn.execute("ALTER TABLE payment_requests ADD COLUMN payment_user_id INTEGER DEFAULT 0")
            conn.commit()
    finally:
        conn.close()

def create_payment_request(requester_id: int, amount: int, message: Optional[str] = None) -> str:
    """
    支払いリクエストを作成してDBに保存し、短い request_id を返す
    """
    ensure_schema()
    conn = get_db_connection()

    # ユニークなリクエストIDを生成（短いID）
    request_id = str(uuid.uuid4())[:8]

    try:
        conn.execute(
            '''
            INSERT INTO payment_requests (request_id, requester_id, amount, message)
            VALUES (?, ?, ?, ?)
            ''',
            (request_id, requester_id, amount, message or '')
        )
        conn.commit()
    finally:
        conn.close()

    return request_id

def get_payment_request(request_id: str) -> Optional[dict]:
    """
    リクエストIDから支払いリクエスト情報を取得
    - 請求者の名前・アバターもJOINで取得
    """
    ensure_schema()
    conn = get_db_connection()
    try:
        row = conn.execute(
            '''
            SELECT pr.*,
                   u.name        AS requester_name,
                   u.avatar_path AS requester_avatar
              FROM payment_requests pr
         LEFT JOIN users u
                ON pr.requester_id = u.user_id
             WHERE pr.request_id = ?
            ''',
            (request_id,)
        ).fetchone()
        return dict(row) if row else None
    finally:
        conn.close()

def process_payment(request_id: str, paid_by_id: int) -> Tuple[bool, str, Optional[int]]:
    """
    支払い処理を行い、請求のステータスを 'success' に更新し、
    payment_user_id に支払い者IDを保存する。
    返り値: (success, message, new_balance or None)
    """
    ensure_schema()
    conn = get_db_connection()

    try:
        # トランザクション開始
        conn.execute("BEGIN TRANSACTION")

        # 未処理の請求のみ取得
        payment_request = conn.execute(
            '''
            SELECT *
              FROM payment_requests
             WHERE request_id = ?
               AND status = "pending"
            ''',
            (request_id,)
        ).fetchone()

        if not payment_request:
            conn.rollback()
            return False, "有効な請求が見つかりませんでした（すでに支払い済み/キャンセル済みの可能性）", None

        amount = int(payment_request['amount'])
        requester_id = int(payment_request['requester_id'])

        # 支払い者のアカウント取得・残高チェック
        payer_account = conn.execute(
            'SELECT * FROM accounts WHERE user_id = ?',
            (paid_by_id,)
        ).fetchone()

        if not payer_account:
            conn.rollback()
            return False, "支払い者のアカウントが見つかりません", None

        if int(payer_account['balance']) < amount:
            conn.rollback()
            return False, "残高不足です", None

        # 請求者のアカウント取得
        requester_account = conn.execute(
            'SELECT * FROM accounts WHERE user_id = ?',
            (requester_id,)
        ).fetchone()

        if not requester_account:
            conn.rollback()
            return False, "請求者のアカウントが見つかりません", None

        # 1) 支払い者の残高を減らす
        conn.execute(
            'UPDATE accounts SET balance = balance - ? WHERE user_id = ?',
            (amount, paid_by_id)
        )

        # 2) 請求者の残高を増やす
        conn.execute(
            'UPDATE accounts SET balance = balance + ? WHERE user_id = ?',
            (amount, requester_id)
        )

        # 3) 請求のステータス/支払い者IDを更新
        conn.execute(
            '''
            UPDATE payment_requests
               SET status = "success",
                   payment_user_id = ?
             WHERE request_id = ?
            ''',
            (paid_by_id, request_id)
        )

        # 新しい支払い者残高を取得
        new_balance_row = conn.execute(
            'SELECT balance FROM accounts WHERE user_id = ?',
            (paid_by_id,)
        ).fetchone()
        new_balance = int(new_balance_row['balance']) if new_balance_row else None

        conn.commit()
        return True, "支払いが完了しました", new_balance

    except Exception as e:
        conn.rollback()
        return False, f"エラーが発生しました: {str(e)}", None

    finally:
        conn.close()
