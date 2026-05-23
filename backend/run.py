# appパッケージからcreate_app関数をインポートします
from app import create_app
import os

# アプリケーションファクトリを呼び出して、アプリのインスタンスを作成します
app = create_app()

# このファイルがPythonインタプリタによって直接実行された場合にのみ、
# 開発用のWebサーバーを起動します
if __name__ == '__main__':
    debug = os.environ.get("FLASK_DEBUG", "0") == "1"
    app.run(host=os.environ.get("HOST", "127.0.0.1"), port=int(os.environ.get("PORT", "5000")), debug=debug)
