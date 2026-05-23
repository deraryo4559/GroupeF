# __init__.py
from flask import Flask
from flask_cors import CORS
import os

def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-only-secret-key")
    
    cors_origins = [
        origin.strip()
        for origin in os.environ.get(
            "CORS_ORIGINS",
            "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174,http://localhost:5175,http://127.0.0.1:5175",
        ).split(",")
        if origin.strip()
    ]
    CORS(app, resources={r"/api/*": {"origins": cors_origins}}, supports_credentials=True)

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

    from .routes.transactions import transactions_bp
    app.register_blueprint(transactions_bp, url_prefix="/api/transactions")

    if os.environ.get("FLASK_DEBUG", "0") == "1":
        print("=== URL MAP ===")
        for rule in app.url_map.iter_rules():
            print(f"{rule.rule} -> {rule.endpoint} [{', '.join(rule.methods)}]")

    return app
