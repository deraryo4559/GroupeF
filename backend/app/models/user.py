from app.db import get_db_connection

def get_all_users(exclude_user_id=None):
    conn = get_db_connection()
    
    query = 'SELECT user_id, name, email, avatar_path, created_at FROM users'
    params = []
    
    if exclude_user_id:
        query += ' WHERE user_id != ?'
        params.append(exclude_user_id)
        
    users = conn.execute(query, params).fetchall()
    conn.close()
    
    return [dict(user) for user in users]
