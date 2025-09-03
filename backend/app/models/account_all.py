import sqlite3

def get_db_connection():
    """データベース接続を取得するヘルパー関数"""
    conn = sqlite3.connect('app/money_app.db')
    # 結果を辞書のようにカラム名でアクセスできるようにする
    conn.row_factory = sqlite3.Row
    return conn

def get_all_accounts(exclude_user_id=None):
    """
    指定されたIDを除く、全ユーザーのリストを取得します。
    送金相手の一覧表示に使用します。
    """
    conn = get_db_connection()
    
    query = 'SELECT user_id, account_number, balance FROM accounts'
    params = []
    
    if exclude_user_id:
        query += ' WHERE user_id != ?'
        params.append(exclude_user_id)
        
    accounts = conn.execute(query, params).fetchall()
    conn.close()
    
    # DBの検索結果をPythonの辞書のリストに変換して返す
    return [dict(account) for account in accounts]