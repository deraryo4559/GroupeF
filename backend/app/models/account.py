from app.db import get_db_connection

def get_account_by_user_id(user_id):
    """
    指定されたuser_idに対応するアカウント情報を取得します。
    """
    conn = get_db_connection()

    query = 'SELECT * FROM accounts WHERE user_id = ?'

    account = conn.execute(query, (user_id,)).fetchone()

    conn.close()

    if account:
        account_dict = dict(account)
        return account_dict
    else:
        return None
