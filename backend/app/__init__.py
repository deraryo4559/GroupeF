from flask import Flask

def create_app():
    """
    アプリケーションのインスタンスを生成し、各機能のBlueprintを登録します。
    """
    app = Flask(__name__)

    # --- APIエンドポイントの登録 ---

    @app.route('/')
    def hello_world():
        """動作確認用のルート"""
        return 'Hello, World! (Blueprint構成)'

    # ユーザーAPIのBlueprintをインポートします
    from .routes.users import users_bp
    
    # `/api/users` というURLでアクセスできるようにAPIを登録します
    app.register_blueprint(users_bp, url_prefix='/api/users')

    # 今後作成する他のAPI（例：取引API）のBlueprintもここに追加していきます
    # from .routes.transactions import transactions_bp
    # app.register_blueprint(transactions_bp, url_prefix='/api/transactions')

    return app

