from flask import Flask

def create_app():
    """
    アプリケーションのインスタンスを生成するファクトリ関数です。
    """
    # Flaskアプリケーションのインスタンスを作成します
    app = Flask(__name__)

    # --- ルートの定義 ---
    # アプリケーションに直接URLの処理を記述します。
    # これが最もシンプルな形です。
    @app.route('/')
    def hello_world():
        return 'Hello, World! (簡易版)'

    # --- 今後の拡張のために ---
    # 機能が増えてきたら、下のコメントを解除して
    # routesフォルダを使ったBlueprintでの管理に切り替えることができます。
    # from .routes.main import main_bp
    # app.register_blueprint(main_bp)

    # 設定済みのアプリケーションインスタンスを返します
    return app

