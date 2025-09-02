# app/routes/accounts.py
from flask import Blueprint, jsonify, request
from app.models import account as account_model

accounts_bp = Blueprint('accounts', __name__)

@accounts_bp.route('/', methods=['GET'])
def get_account_list():
    """全アカウントリストを返す"""
    exclude_id = request.args.get('exclude_id', type=int)
    accounts = account_model.get_all_accounts(exclude_user_id=exclude_id)
    return jsonify(accounts)

# ★ 個別アカウント取得 API を追加
@accounts_bp.route('/<int:user_id>', methods=['GET'])
def get_account_by_user(user_id):
    # こちらもモデルを使ってIDで一件だけ取得するべき
    account = account_model.get_account_by_user_id(user_id)
    if account:
        return jsonify(account)
    return jsonify({"error": "account not found"}), 404

