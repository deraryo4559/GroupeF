# app/routes/accounts.py
from flask import Blueprint, jsonify, request
from app.models import account_all as account_model

accounts_bp = Blueprint('accounts_all', __name__)

@accounts_bp.route('/', methods=['GET'])
def get_account_list():
    """全アカウントリストを返す"""
    exclude_id = request.args.get('exclude_id', type=int)
    accounts = account_model.get_all_accounts(exclude_user_id=exclude_id)
    return jsonify(accounts)