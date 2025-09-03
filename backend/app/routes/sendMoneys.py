# routes/sendMoneys.py
from flask import Blueprint, request, jsonify
from app.models import sendMoney as sendMoney_model

send_money_bp = Blueprint('send_money', __name__)

@send_money_bp.route('/', methods=['POST', 'OPTIONS'])
def send_money():
    """
    送金を処理するAPIエンドポイント
    """
    # プリフライトリクエスト（OPTIONS）への対応
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'OK'})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With')
        response.headers.add('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response, 200
    
    try:
        # リクエストデータの取得
        data = request.get_json()
        print(f"Received data: {data}")  # デバッグ用
        
        if not data:
            return jsonify({'status': 'error', 'message': 'JSONデータが必要です'}), 400
        
        sender_id = data.get('sender_id')
        receiver_id = data.get('receiver_id') 
        amount = data.get('amount')
        message = data.get('message', '')

        print(f"Parsed: sender_id={sender_id}, receiver_id={receiver_id}, amount={amount}")  # デバッグ用

        # バリデーション
        if not all([sender_id is not None, receiver_id is not None, amount is not None]):
            return jsonify({
                'status': 'error', 
                'message': '送金者ID、受取者ID、金額は必須です'
            }), 400

        if not isinstance(amount, (int, float)) or amount <= 0:
            return jsonify({
                'status': 'error', 
                'message': '金額は正の数値である必要があります'
            }), 400

        # 送金処理を実行
        result = sendMoney_model.send_money(sender_id, receiver_id, amount, message)
        print(f"Send money result: {result}")  # デバッグ用
        
        if result['status'] == 'success':
            return jsonify(result), 200
        else:
            return jsonify(result), 400

    except Exception as e:
        print(f"Error in send_money: {str(e)}")  # デバッグ用
        return jsonify({
            'status': 'error', 
            'message': f'サーバーエラーが発生しました: {str(e)}'
        }), 500