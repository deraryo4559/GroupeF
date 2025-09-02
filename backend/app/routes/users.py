from flask import Blueprint, jsonify, request
from app.models import user as user_model

# 'users'という名前でBlueprintを作成
users_bp = Blueprint('users', __name__)

@users_bp.route('/', methods=['GET'])
def get_user_list():
    """
    送金相手の候補となるユーザーリストを取得するAPI。
    例: /api/users?exclude_id=1  (user_id=1の人以外を取得)
    """
    # URLのクエリパラメータから除外するユーザーIDを取得
    exclude_id = request.args.get('exclude_id', type=int)
    
    # models/user.py の関数を呼び出してデータを取得
    users = user_model.get_all_users(exclude_user_id=exclude_id)
    
    return jsonify(users)
