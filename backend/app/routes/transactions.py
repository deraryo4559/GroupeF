# app/routes/transactions.py
from flask import Blueprint, request, jsonify, current_app
from flask_cors import cross_origin
import sqlite3, os

transactions_bp = Blueprint("transactions", __name__)

def _db_path() -> str:
    return os.path.join(current_app.root_path, "money_app.db")

@transactions_bp.route("/", methods=["GET"])
@cross_origin()
def list_transactions():
    """
    GET /api/transactions/?user_id=52
    認証ユーザー(user_id)に紐づく口座の取引を返す。名前/アイコンも同梱。
    """
    user_id = request.args.get("user_id", type=int)
    if not user_id:
        return jsonify({"ok": False, "message": "user_id is required"}), 400

    conn = sqlite3.connect(_db_path())
    conn.row_factory = sqlite3.Row
    try:
        cur = conn.cursor()
        # このユーザーの口座IDを取得
        acc = cur.execute(
            "SELECT id FROM accounts WHERE user_id = ?",
            (user_id,)
        ).fetchone()
        if not acc:
            return jsonify({"ok": True, "items": []})

        my_acc_id = acc["id"]

        # 取引を取得（自分の口座が送金元/先に含まれるもの）
        rows = cur.execute("""
            SELECT
              t.id, t.sender_account_id, t.receiver_account_id,
              t.amount, t.currency, t.message, t.status, t.transaction_type, t.created_at,

              sacc.user_id AS sender_user_id,
              su.name      AS sender_name,
              COALESCE(su.avatar_path, '/images/human2.png') AS sender_avatar,

              racc.user_id AS receiver_user_id,
              ru.name      AS receiver_name,
              COALESCE(ru.avatar_path, '/images/human2.png') AS receiver_avatar
            FROM transactions t
              LEFT JOIN accounts sacc ON sacc.id = t.sender_account_id
              LEFT JOIN users    su   ON su.user_id = sacc.user_id
              LEFT JOIN accounts racc ON racc.id = t.receiver_account_id
              LEFT JOIN users    ru   ON ru.user_id = racc.user_id
            WHERE t.sender_account_id   = ?
               OR t.receiver_account_id = ?
            ORDER BY t.id DESC
        """, (my_acc_id, my_acc_id)).fetchall()

        items = []
        for r in rows:
            items.append({
                "id": r["id"],
                "sender_account_id": r["sender_account_id"],
                "receiver_account_id": r["receiver_account_id"],
                "amount": r["amount"],
                "currency": r["currency"],
                "message": r["message"],
                "status": r["status"],
                "transaction_type": r["transaction_type"],
                "created_at": r["created_at"],

                # 追加: 相手情報を使えるように同梱
                "sender_user_id": r["sender_user_id"],
                "sender_name":    r["sender_name"],
                "sender_avatar":  r["sender_avatar"],
                "receiver_user_id": r["receiver_user_id"],
                "receiver_name":    r["receiver_name"],
                "receiver_avatar":  r["receiver_avatar"],
            })
        return jsonify({"ok": True, "items": items})
    finally:
        conn.close()
