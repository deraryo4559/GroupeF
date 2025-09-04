# app/routes/auth.py
from flask import Blueprint, request, jsonify, current_app
from flask_cors import cross_origin
import sqlite3, os,hashlib, random, string, datetime
import random

# ユーザー登録部分
avatar_number = random.randint(1, 6)  # 1～6 のランダム整数
avatar_path = f"/images/human{avatar_number}.png"

auth_bp = Blueprint("auth", __name__)

def _db_path() -> str:
    return os.path.join(current_app.root_path, "money_app.db")

@auth_bp.route("/mock-login", methods=["POST"])
@cross_origin()
def mock_login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip()
    password = (data.get("password") or "").strip()

    # 入力されたパスワードをハッシュ化
    password_hash = _hash_password(password)

    conn = sqlite3.connect(_db_path())
    conn.row_factory = sqlite3.Row
    try:
        row = conn.execute(
            "SELECT user_id, name, email FROM users WHERE email=? AND password_hash=?",
            (email, password_hash),
        ).fetchone()
        if not row:
            return jsonify({"ok": False, "message": "invalid credentials"}), 401

        return jsonify({
            "ok": True,
            "user": {
                "user_id": row["user_id"],
                "name": row["name"],
                "email": row["email"],
            }
        }), 200
    finally:
        conn.close()


@auth_bp.route("/ping", methods=["GET"])  # ここも GET のみでOK
@cross_origin()
def ping():
    return jsonify({"ok": True})





def _hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

def _generate_account_number() -> str:
    return ''.join(random.choices(string.digits, k=10))

@auth_bp.route("/register", methods=["POST"])
@cross_origin()
def register():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip()
    password = (data.get("password") or "").strip()

    if not all([name, email, password]):
        return jsonify({"ok": False, "message": "name, email, password が必要です"}), 400

    conn = sqlite3.connect(_db_path())
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    cur.execute("SELECT 1 FROM users WHERE email=?", (email,))
    if cur.fetchone():
        conn.close()
        return jsonify({"ok": False, "message": "このメールアドレスは既に登録されています"}), 400

    now = datetime.datetime.utcnow().isoformat()
    password_hash = _hash_password(password)

    try:
        cur.execute("""
            INSERT INTO users (name, email, password_hash, phone_number, avatar_path, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (name, email, password_hash, None, avatar_path, now, now))
        user_id = cur.lastrowid

        account_number = _generate_account_number()
        cur.execute("""
            INSERT INTO accounts (user_id, account_number, balance, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?)
        """, (user_id, account_number, 100000, now, now))

        conn.commit()
    except Exception as e:
        conn.rollback()
        conn.close()
        return jsonify({"ok": False, "message": f"DBエラー: {str(e)}"}), 500

    conn.close()

    return jsonify({
        "ok": True,
        "message": "ユーザー登録成功",
        "user": {
            "user_id": user_id,
            "name": name,
            "email": email,
            "account_number": account_number,
            "balance": 0,
        }
    }), 201