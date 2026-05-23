# app/routes/auth.py
from flask import Blueprint, request, jsonify, current_app
from flask_cors import cross_origin
from werkzeug.security import check_password_hash, generate_password_hash
import random, string, datetime

from app.auth_utils import create_access_token
from app.db import get_db_connection

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/mock-login", methods=["POST"])
@cross_origin()
def mock_login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip()
    password = (data.get("password") or "").strip()

    conn = get_db_connection()
    try:
        row = conn.execute(
            "SELECT user_id, name, email, password_hash FROM users WHERE email=?",
            (email,),
        ).fetchone()
        if not row or not check_password_hash(row["password_hash"], password):
            return jsonify({"ok": False, "message": "invalid credentials"}), 401

        user = {
            "user_id": row["user_id"],
            "name": row["name"],
            "email": row["email"],
        }

        return jsonify({
            "ok": True,
            "user": user,
            "access_token": create_access_token(user),
        }), 200
    finally:
        conn.close()


@auth_bp.route("/ping", methods=["GET"])  # ここも GET のみでOK
@cross_origin()
def ping():
    return jsonify({"ok": True})





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

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("SELECT 1 FROM users WHERE email=?", (email,))
    if cur.fetchone():
        conn.close()
        return jsonify({"ok": False, "message": "このメールアドレスは既に登録されています"}), 400

    now = datetime.datetime.utcnow().isoformat()
    password_hash = generate_password_hash(password)

    try:
        cur.execute("""
            INSERT INTO users (name, email, password_hash, phone_number, avatar_path, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (name, email, password_hash, None, "/images/human2.png", now, now))
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
        current_app.logger.exception("register failed")
        return jsonify({"ok": False, "message": "DBエラーが発生しました"}), 500

    conn.close()

    return jsonify({
        "ok": True,
        "message": "ユーザー登録成功",
        "user": {
            "user_id": user_id,
            "name": name,
            "email": email,
            "account_number": account_number,
            "balance": 100000,
        },
        "access_token": create_access_token({
            "user_id": user_id,
            "name": name,
            "email": email,
        }),
    }), 201
