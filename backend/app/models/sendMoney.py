# sendMoney.py
from app.models.user import get_db_connection

def send_money(sender_id, receiver_id, amount, message=""):
    conn = get_db_connection()
    cur = conn.cursor()

    try:
        # 送金元の残高を取得
        cur.execute("SELECT balance FROM accounts WHERE user_id = ?", (sender_id,))
        sender_balance = cur.fetchone()
        if not sender_balance:
            raise ValueError("送金元ユーザーが存在しません")
        
        current_balance = sender_balance[0]
        if current_balance < amount:
            raise ValueError("残高不足です")

        # 送金先が存在するかチェック
        cur.execute("SELECT user_id FROM accounts WHERE user_id = ?", (receiver_id,))
        receiver_exists = cur.fetchone()
        if not receiver_exists:
            raise ValueError("送金先ユーザーが存在しません")

        # 送金処理
        cur.execute("UPDATE accounts SET balance = balance - ? WHERE user_id = ?", (amount, sender_id))
        cur.execute("UPDATE accounts SET balance = balance + ? WHERE user_id = ?", (amount, receiver_id))

        # 送金履歴を記録する場合
        # cur.execute("""
        #     INSERT INTO transactions (sender_id, receiver_id, amount, message, created_at)
        #     VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
        # """, (sender_id, receiver_id, amount, message))

        conn.commit()

        # 新しい残高を取得
        cur.execute("SELECT balance FROM accounts WHERE user_id = ?", (sender_id,))
        new_balance = cur.fetchone()[0]

        return {
            "status": "success",
            "message": "送金が完了しました",
            "amount": amount,
            "new_balance": new_balance
        }

    except Exception as e:
        conn.rollback()
        return {"status": "error", "message": str(e)}

    finally:
        cur.close()
        conn.close()
