# app/routes/requests.py
from flask import Blueprint, request, jsonify, current_app
from flask_cors import cross_origin
import sqlite3, os, secrets

# Blueprintを作成
requests_bp = Blueprint("requests", __name__)

# DBパスを組み立てる関数
def _db_path() -> str:
    return os.path.join(current_app.root_path, "money_app.db")

# --- 請求作成API ---
@requests_bp.route("/", methods=["POST", "OPTIONS"])
@cross_origin()
def create_request():
    """
    POST /api/requests/
    Body: { "requester_user_id": 52, "amount": 3000, "message": "飲み会代" }
    """
    data = request.get_json(silent=True) or {}
    requester_user_id = int(data.get("requester_user_id") or 0)
    amount = int(data.get("amount") or 0)
    message = (data.get("message") or "").strip()

    # バリデーション
    if requester_user_id <= 0:
        return jsonify({"ok": False, "message": "requester_user_id is required"}), 400
    if amount < 1 or amount > 50000:
        return jsonify({"ok": False, "message": "amount must be 1..50000"}), 400

    token = secrets.token_urlsafe(8)  # 請求リンク用の短い識別子

    conn = sqlite3.connect(_db_path())
    conn.row_factory = sqlite3.Row
    try:
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO payment_requests (token, requester_user_id, amount, message)
            VALUES (?, ?, ?, ?)
        """, (token, requester_user_id, amount, message))
        conn.commit()

        row = cur.execute(
            "SELECT * FROM payment_requests WHERE token = ?",
            (token,)
        ).fetchone()

        # フロントで利用するリンク
        link = f"{request.host_url.rstrip('/')}/pay/{row['token']}"

        return jsonify({
            "ok": True,
            "request": {
                "id": row["id"],
                "token": row["token"],
                "link": link,
                "requester_user_id": row["requester_user_id"],
                "amount": row["amount"],
                "message": row["message"],
                "status": row["status"],
                "created_at": row["created_at"],
            }
        }), 201
    finally:
        conn.close()


# --- 請求一覧API ---
@requests_bp.route("/", methods=["GET"])
@cross_origin()
def list_requests():
    """
    GET /api/requests/?requester_user_id=52
    """
    requester_user_id = request.args.get("requester_user_id", type=int)
    if not requester_user_id:
        return jsonify({"ok": False, "message": "requester_user_id is required"}), 400

    conn = sqlite3.connect(_db_path())
    conn.row_factory = sqlite3.Row
    try:
        rows = conn.execute("""
            SELECT id, token, requester_user_id, amount, message, status, created_at
            FROM payment_requests
            WHERE requester_user_id = ?
            ORDER BY id DESC
        """, (requester_user_id,)).fetchall()

        items = []
        for r in rows:
            items.append({
                "id": r["id"],
                "token": r["token"],
                "link": f"{request.host_url.rstrip('/')}/pay/{r['token']}",
                "requester_user_id": r["requester_user_id"],
                "amount": r["amount"],
                "message": r["message"],
                "status": r["status"],
                "created_at": r["created_at"],
            })
        return jsonify({"ok": True, "items": items})
    finally:
        conn.close()

# --- 請求キャンセルAPI ---
@requests_bp.route("/<int:request_id>/cancel", methods=["POST", "OPTIONS"])
@cross_origin()
def cancel_request(request_id):
    """
    POST /api/requests/<id>/cancel
    Body: {}
    """
    conn = sqlite3.connect(_db_path())
    conn.row_factory = sqlite3.Row
    try:
        cur = conn.cursor()

        # ステータスを canceled に更新
        cur.execute("""
            UPDATE payment_requests
            SET status = 'canceled'
            WHERE id = ? AND status != 'success'
        """, (request_id,))
        conn.commit()

        if cur.rowcount == 0:
            return jsonify({"ok": False, "message": "not found or already completed"}), 404

        row = cur.execute("SELECT * FROM payment_requests WHERE id = ?", (request_id,)).fetchone()

        return jsonify({
            "ok": True,
            "request": {
                "id": row["id"],
                "status": row["status"],
                "message": row["message"],
                "amount": row["amount"],
                "created_at": row["created_at"],
            }
        })
    finally:
        conn.close()
