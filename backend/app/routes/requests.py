# app/routes/requests.py
from flask import Blueprint, request, jsonify, current_app
from flask_cors import cross_origin
import secrets

from app.auth_utils import current_user_id, require_auth
from app.db import get_db_connection

# Blueprintを作成
requests_bp = Blueprint("requests", __name__)

# --- 請求作成API ---
@requests_bp.route("/", methods=["POST"])
@cross_origin()
@require_auth
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
    if requester_user_id != current_user_id():
        return jsonify({"ok": False, "message": "forbidden"}), 403
    if amount < 1 or amount > 50000:
        return jsonify({"ok": False, "message": "amount must be 1..50000"}), 400

    token = secrets.token_urlsafe(8)  # 請求リンク用の短い識別子

    conn = get_db_connection()
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

        # フロントで利用するリンク - ポート3000のフロントエンドURL
        # 注: host_urlはFlaskサーバーのURL（localhost:5000）なので、ここでは単にtokenのみを返す
        # フロントエンド側でフルURLを構築する

        return jsonify({
            "ok": True,
            "request": {
                "id": row["id"],
                "token": row["token"],
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
@require_auth
def list_requests():
    """
    GET /api/requests/?requester_user_id=52
    """
    requester_user_id = request.args.get("requester_user_id", type=int)
    if not requester_user_id:
        return jsonify({"ok": False, "message": "requester_user_id is required"}), 400
    if requester_user_id != current_user_id():
        return jsonify({"ok": False, "message": "forbidden"}), 403

    conn = get_db_connection()
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
@require_auth
def cancel_request(request_id):
    """
    POST /api/requests/<id>/cancel
    Body: {}
    """
    conn = get_db_connection()
    try:
        cur = conn.cursor()

        # ステータスを canceled に更新
        cur.execute("""
            UPDATE payment_requests
            SET status = 'canceled'
            WHERE id = ? AND requester_user_id = ? AND status != 'success'
        """, (request_id, current_user_id()))
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
# --- トークンから請求情報を取得するAPI ---
@requests_bp.route("/<token>", methods=["GET"])
@cross_origin()
def get_request_by_token(token):
    """
    GET /api/requests/:token
    トークンを指定して請求情報を取得する
    """
    if not token:
        return jsonify({"ok": False, "message": "token is required"}), 400

    conn = get_db_connection()
    try:
        # 請求情報を取得
        row = conn.execute("""
            SELECT r.*, u.name as requester_name, u.avatar_path as requester_avatar
            FROM payment_requests r
            LEFT JOIN users u ON r.requester_user_id = u.user_id
            WHERE r.token = ?
        """, (token,)).fetchone()
        
        if not row:
            return jsonify({"ok": False, "message": "Request not found"}), 404
            
        request_data = {
            "id": row["id"],
            "token": row["token"],
            "requester_user_id": row["requester_user_id"],
            "requester_name": row["requester_name"],
            "requester_avatar": row["requester_avatar"],
            "amount": row["amount"],
            "message": row["message"],
            "status": row["status"],
            "created_at": row["created_at"]
        }
        
        return jsonify({"ok": True, "request": request_data})
    finally:
        conn.close()


# --- 支払い処理API ---
@requests_bp.route("/<token>/pay", methods=["POST"])
@cross_origin()
@require_auth
def pay_request(token):
    """
    POST /api/requests/:token/pay
    Body: { "paid_by_id": 53 }
    トークンを指定して支払い処理を行う
    """
    if not token:
        return jsonify({"ok": False, "message": "token is required"}), 400
        
    data = request.get_json(silent=True) or {}
    paid_by_id = int(data.get("paid_by_id") or 0)
    
    if paid_by_id <= 0:
        return jsonify({"ok": False, "message": "paid_by_id is required"}), 400
    if paid_by_id != current_user_id():
        return jsonify({"ok": False, "message": "forbidden"}), 403
    
    conn = get_db_connection()
    
    try:
        # トランザクション開始
        conn.execute("BEGIN TRANSACTION")
        
        # 請求情報を取得
        request_row = conn.execute("""
            SELECT * FROM payment_requests
            WHERE token = ? AND status = 'pending'
        """, (token,)).fetchone()
        
        if not request_row:
            conn.rollback()
            return jsonify({
                "ok": False, 
                "message": "有効な請求が見つかりません。既に支払い済みか、キャンセルされた可能性があります。"
            }), 400
        
        # 支払い者の残高チェック
        payer_account = conn.execute("""
            SELECT * FROM accounts WHERE user_id = ?
        """, (paid_by_id,)).fetchone()
        
        if not payer_account:
            conn.rollback()
            return jsonify({"ok": False, "message": "支払い者のアカウントが見つかりません"}), 400
            
        if payer_account["balance"] < request_row["amount"]:
            conn.rollback()
            return jsonify({"ok": False, "message": "残高不足のため支払いできません"}), 400
        
        # 請求者のアカウント取得
        requester_account = conn.execute("""
            SELECT * FROM accounts WHERE user_id = ?
        """, (request_row["requester_user_id"],)).fetchone()
        
        if not requester_account:
            conn.rollback()
            return jsonify({"ok": False, "message": "請求者のアカウントが見つかりません"}), 400
        
        # 支払い処理実行
        # 1. 支払い者の残高を減らす
        conn.execute("""
            UPDATE accounts SET balance = balance - ? WHERE user_id = ?
        """, (request_row["amount"], paid_by_id))
        
        # 2. 請求者の残高を増やす
        conn.execute("""
            UPDATE accounts SET balance = balance + ? WHERE user_id = ?
        """, (request_row["amount"], request_row["requester_user_id"]))
        
        # 3. 請求のステータスを更新
        conn.execute("""
            UPDATE payment_requests SET status = 'success' WHERE token = ?
        """, (token,))
        
        # 変更を確定
        conn.commit()
        
        # 最新の支払い者残高を取得
        new_balance = conn.execute("""
            SELECT balance FROM accounts WHERE user_id = ?
        """, (paid_by_id,)).fetchone()["balance"]
        
        return jsonify({
            "ok": True, 
            "message": "支払いが完了しました", 
            "new_balance": new_balance
        })
    
    except Exception as e:
        conn.rollback()
        current_app.logger.exception("pay request failed")
        return jsonify({"ok": False, "message": "エラーが発生しました"}), 500
    
    finally:
        conn.close()
