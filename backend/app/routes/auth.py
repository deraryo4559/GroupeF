# app/routes/auth.py
from flask import Blueprint, request, jsonify, current_app
from flask_cors import cross_origin
import sqlite3, os

auth_bp = Blueprint("auth", __name__)

def _db_path() -> str:
    return os.path.join(current_app.root_path, "money_app.db")

@auth_bp.route("/mock-login", methods=["POST"])  # ← OPTIONSを外す
@cross_origin()  # ← これが自動プリフライト対応+レスポンスにCORSヘッダ付与
def mock_login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip()
    password = (data.get("password") or "").strip()

    conn = sqlite3.connect(_db_path())
    conn.row_factory = sqlite3.Row
    try:
        row = conn.execute(
            "SELECT user_id, name, email FROM users WHERE email=? AND password_hash=?",
            (email, password),
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
