from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    # /api/* をCORS許可
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    @app.route("/")
    def hello_world():
        return "Hello, World! (Blueprint構成)"

    # 既存
    from .routes.users import users_bp
    app.register_blueprint(users_bp, url_prefix="/api/users")

    from .routes.accounts import accounts_bp
    app.register_blueprint(accounts_bp, url_prefix="/api/accounts")

    # ★ 追加：auth ルートを登録
    from .routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    # 請求データをpayment_requestテーブルに保存
    from .routes.requests import requests_bp
    app.register_blueprint(requests_bp, url_prefix="/api/requests")

    # デバッグ：URLマップを起動時に出力
    print("=== URL MAP ===")
    print(app.url_map)

    from .routes.accounts_all import accounts_bp
    app.register_blueprint(accounts_bp, url_prefix='/api/accounts_all')

    return app
