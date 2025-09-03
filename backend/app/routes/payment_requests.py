from flask import Blueprint, request, jsonify
from app.models import payment_request as pr_model

payment_requests_bp = Blueprint('payment_requests', __name__)

@payment_requests_bp.route('/', methods=['POST'])
def create_request():
    """
    請求リンクを作成するAPI
    必要なデータ: requester_id, amount, message(オプション)
    """
    data = request.json
    
    if not data or 'requester_id' not in data or 'amount' not in data:
        return jsonify({'error': '必要なデータが不足しています'}), 400
    
    try:
        requester_id = int(data['requester_id'])
        amount = int(data['amount'])
        message = data.get('message', '')
        
        if amount <= 0:
            return jsonify({'error': '金額は1円以上である必要があります'}), 400
        
        request_id = pr_model.create_payment_request(requester_id, amount, message)
        
        return jsonify({
            'success': True,
            'request_id': request_id
        }), 201
        
    except ValueError:
        return jsonify({'error': 'データ形式が不正です'}), 400
    except Exception as e:
        return jsonify({'error': f'エラーが発生しました: {str(e)}'}), 500

@payment_requests_bp.route('/<request_id>', methods=['GET'])
def get_request(request_id):
    """
    リクエストIDから請求情報を取得するAPI
    """
    payment_request = pr_model.get_payment_request(request_id)
    
    if payment_request:
        return jsonify(payment_request)
    else:
        return jsonify({'error': '請求が見つかりません'}), 404

@payment_requests_bp.route('/<request_id>/pay', methods=['POST'])
def process_payment(request_id):
    """
    支払い処理を行うAPI
    必要なデータ: paid_by_id (支払いを行うユーザーのID)
    """
    data = request.json
    
    if not data or 'paid_by_id' not in data:
        return jsonify({'error': '支払い者のIDが必要です'}), 400
    
    try:
        paid_by_id = int(data['paid_by_id'])
        
        success, message = pr_model.process_payment(request_id, paid_by_id)
        
        if success:
            return jsonify({
                'success': True,
                'message': message
            })
        else:
            return jsonify({
                'success': False,
                'message': message
            }), 400
            
    except ValueError:
        return jsonify({'error': 'データ形式が不正です'}), 400
    except Exception as e:
        return jsonify({'error': f'エラーが発生しました: {str(e)}'}), 500
