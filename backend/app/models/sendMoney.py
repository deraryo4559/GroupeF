# sendMoney.py
from app.models.user import get_db_connection

def send_money(sender_id, receiver_id, amount, message=""):
    """
    sender_id / receiver_id は users.user_id
    transactions には accounts.id を保存する
    """
    conn = get_db_connection()
    cur = conn.cursor()

    try:
        amount = int(amount)

        # 送金元口座（id と balance）取得
        cur.execute("SELECT id, balance FROM accounts WHERE user_id = ?", (sender_id,))
        sender_row = cur.fetchone()
        if not sender_row:
            raise ValueError("送金元ユーザーが存在しません")
        sender_account_id, sender_balance = sender_row[0], sender_row[1]

        if sender_balance < amount:
            raise ValueError("残高不足です")

        # 送金先口座（id）取得
        cur.execute("SELECT id FROM accounts WHERE user_id = ?", (receiver_id,))
        recv_row = cur.fetchone()
        if not recv_row:
            raise ValueError("送金先ユーザーが存在しません")
        receiver_account_id = recv_row[0]

        # 送金（残高更新）
        cur.execute("UPDATE accounts SET balance = balance - ? WHERE id = ?", (amount, sender_account_id))
        cur.execute("UPDATE accounts SET balance = balance + ? WHERE id = ?", (amount, receiver_account_id))

        # 取引履歴を登録（transactions）
        cur.execute(
            """
            INSERT INTO transactions (
                sender_account_id,
                receiver_account_id,
                amount,
                currency,
                message,
                status,
                transaction_type
            )
            VALUES (?, ?, ?, 'JPY', ?, 'completed', 'transfer')
            """,
            (sender_account_id, receiver_account_id, amount, message or "")
        )

        conn.commit()

        # 新しい残高を返す
        cur.execute("SELECT balance FROM accounts WHERE id = ?", (sender_account_id,))
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
