from flask import Blueprint, jsonify, request
from app.models import account as account_model

# 'accounts'という名前でBlueprintを作成 (必要に応じて)
accounts_bp = Blueprint('accounts', __name__)   
@accounts_bp.route('/<int:user_id>', methods=['GET'])
def get_account(user_id):
    """
    指定されたuser_idに対応するアカウント情報を取得するAPI。
    例: /api/accounts/1  (user_id=1の人のアカウント情報を取得)
    """
    # models/account.py の関数を呼び出してデータを取得
    account = account_model.get_account_by_user_id(user_id)
    
    if account:
        return jsonify(account)
    else:
        return jsonify({'error': 'Account not found'}), 404