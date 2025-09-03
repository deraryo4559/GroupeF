import sqlite3

def get_db_connection():
    """データベース接続を取得するヘルパー関数"""
    conn = sqlite3.connect('app/money_app.db')
    # 結果を辞書のようにカラム名でアクセスできるようにする
    conn.row_factory = sqlite3.Row
    return conn

def get_account_by_user_id(user_id):
    """
    指定されたuser_idに対応するアカウント情報を取得します。
    """
    print(f"[DEBUG] get_account_by_user_id() called with user_id={user_id}")

    conn = get_db_connection()
    conn.row_factory = sqlite3.Row   # dict化できるようにする

    query = 'SELECT * FROM accounts WHERE user_id = ?'
    print(f"[DEBUG] Executing query: {query} with user_id={user_id}")

    account = conn.execute(query, (user_id,)).fetchone()
    print(f"[DEBUG] Raw fetched result: {account}")

    conn.close()
    print("[DEBUG] Connection closed")

    if account:
        account_dict = dict(account)
        print(f"[DEBUG] Converted to dict: {account_dict}")
        return account_dict
    else:
        print("[DEBUG] No account found for this user_id")
        return None
