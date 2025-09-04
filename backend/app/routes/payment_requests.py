# app/routes/payment_requests.py
from flask import Blueprint, request, jsonify
from app.models import payment_request as pr_model

payment_requests_bp = Blueprint('payment_requests', __name__)

@payment_requests_bp.route('/', methods=['POST'])
def create_request():
    """
    請求リンクを作成するAPI（旧系: request_id を返す）
    必要なデータ: requester_id, amount, message(任意)
    """
    data = request.get_json(silent=True) or {}

    if 'requester_id' not in data or 'amount' not in data:
        return jsonify({'success': False, 'message': '必要なデータが不足しています'}), 400

    try:
        requester_id = int(data['requester_id'])
        amount = int(data['amount'])
        message = (data.get('message') or '').strip()

        if amount <= 0:
            return jsonify({'success': False, 'message': '金額は1円以上である必要があります'}), 400

        request_id = pr_model.create_payment_request(requester_id, amount, message)

        return jsonify({
            'success': True,
            'request_id': request_id
        }), 201

    except ValueError:
        return jsonify({'success': False, 'message': 'データ形式が不正です'}), 400
    except Exception as e:
        return jsonify({'success': False, 'message': f'エラーが発生しました: {str(e)}'}), 500


@payment_requests_bp.route('/<request_id>', methods=['GET'])
def get_request(request_id):
    """
    リクエストIDから請求情報を取得するAPI（請求者の名前/アバター込み）
    """
    try:
        pr = pr_model.get_payment_request(request_id)
        if pr:
            return jsonify({'success': True, 'request': pr})
        else:
            return jsonify({'success': False, 'message': '請求が見つかりません'}), 404
    except Exception as e:
        return jsonify({'success': False, 'message': f'エラーが発生しました: {str(e)}'}), 500


@payment_requests_bp.route('/<request_id>/pay', methods=['POST'])
def process_payment(request_id):
    """
    支払い処理を行うAPI
    Body: { paid_by_id: <支払いユーザーID> }
    成功時: payment_requests.status = 'success' / payment_user_id = paid_by_id
    """
    data = request.get_json(silent=True) or {}

    if 'paid_by_id' not in data:
        return jsonify({'success': False, 'message': '支払い者のID (paid_by_id) が必要です'}), 400

    try:
        paid_by_id = int(data['paid_by_id'])

        ok, msg, new_balance = pr_model.process_payment(request_id, paid_by_id)

        if ok:
            return jsonify({
                'success': True,
                'message': msg,
                'payment_user_id': paid_by_id,
                'new_balance': new_balance
            })
        else:
            return jsonify({
                'success': False,
                'message': msg
            }), 400

    except ValueError:
        return jsonify({'success': False, 'message': 'データ形式が不正です'}), 400
    except Exception as e:
        return jsonify({'success': False, 'message': f'エラーが発生しました: {str(e)}'}), 500
