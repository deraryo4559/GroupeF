import sqlite3
import uuid

def get_db_connection():
    """データベース接続を取得するヘルパー関数"""
    conn = sqlite3.connect('app/money_app.db')
    conn.row_factory = sqlite3.Row
    return conn

def create_payment_request(requester_id, amount, message=None):
    """
    支払いリクエストを作成してDBに保存し、request_idを返す
    """
    conn = get_db_connection()
    
    # ユニークなリクエストIDを生成
    request_id = str(uuid.uuid4())[:8]  # 短いID
    
    conn.execute(
        'INSERT INTO payment_requests (request_id, requester_id, amount, message) VALUES (?, ?, ?, ?)',
        (request_id, requester_id, amount, message)
    )
    conn.commit()
    conn.close()
    
    return request_id

def get_payment_request(request_id):
    """
    リクエストIDから支払いリクエスト情報を取得
    """
    conn = get_db_connection()
    
    # 支払いリクエスト情報と請求者の情報を結合取得
    query = '''
    SELECT pr.*, u.name as requester_name, u.avatar_path as requester_avatar
    FROM payment_requests pr
    JOIN users u ON pr.requester_id = u.user_id
    WHERE pr.request_id = ?
    '''
    
    payment_request = conn.execute(query, (request_id,)).fetchone()
    conn.close()
    
    if payment_request:
        return dict(payment_request)
    return None

def process_payment(request_id, paid_by_id):
    """
    支払い処理を行い、請求のステータスを更新
    """
    conn = get_db_connection()
    
    # 支払いリクエストを取得
    payment_request = conn.execute(
        'SELECT * FROM payment_requests WHERE request_id = ? AND status = "pending"', 
        (request_id,)
    ).fetchone()
    
    if not payment_request:
        conn.close()
        return False, "有効な請求が見つかりませんでした"
    
    # 支払い処理のトランザクション開始
    try:
        # 支払い者の残高チェック
        payer_account = conn.execute(
            'SELECT * FROM accounts WHERE user_id = ?', 
            (paid_by_id,)
        ).fetchone()
        
        if not payer_account or payer_account['balance'] < payment_request['amount']:
            conn.close()
            return False, "残高不足です"
            
        # 請求者のアカウント取得
        requester_account = conn.execute(
            'SELECT * FROM accounts WHERE user_id = ?', 
            (payment_request['requester_id'],)
        ).fetchone()
        
        if not requester_account:
            conn.close()
            return False, "請求者のアカウントが見つかりません"
        
        # 支払い者の残高を減らす
        conn.execute(
            'UPDATE accounts SET balance = balance - ? WHERE user_id = ?',
            (payment_request['amount'], paid_by_id)
        )
        
        # 請求者の残高を増やす
        conn.execute(
            'UPDATE accounts SET balance = balance + ? WHERE user_id = ?',
            (payment_request['amount'], payment_request['requester_id'])
        )
        
        # 請求ステータスを更新
        conn.execute(
            'UPDATE payment_requests SET status = "paid", paid_by_id = ? WHERE request_id = ?',
            (paid_by_id, request_id)
        )
        
        conn.commit()
        return True, "支払いが完了しました"
        
    except Exception as e:
        conn.rollback()
        return False, f"エラーが発生しました: {str(e)}"
    finally:
        conn.close()
