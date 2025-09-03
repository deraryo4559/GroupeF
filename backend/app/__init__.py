# __init__.py
from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    
    # より詳細なCORS設定
    CORS(app)

    @app.route("/")
    def hello_world():
        return "Hello, World! (Blueprint構成)"

    # Blueprint登録（重複を修正）
    from .routes.users import users_bp
    app.register_blueprint(users_bp, url_prefix="/api/users")

    from .routes.accounts import accounts_bp
    app.register_blueprint(accounts_bp, url_prefix="/api/accounts")

    from .routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    from .routes.requests import requests_bp
    app.register_blueprint(requests_bp, url_prefix="/api/requests")

    # accounts_allは異なる名前でBlueprintを作成
    from .routes.accounts_all import accounts_all_bp
    app.register_blueprint(accounts_all_bp, url_prefix='/api/accounts_all')

    
    from .routes.sendMoneys import send_money_bp
    app.register_blueprint(send_money_bp, url_prefix='/api/send_money')

    # デバッグ：URLマップを起動時に出力
    print("=== URL MAP ===")
    for rule in app.url_map.iter_rules():
        print(f"{rule.rule} -> {rule.endpoint} [{', '.join(rule.methods)}]")

    return app