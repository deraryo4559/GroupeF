# appパッケージからcreate_app関数をインポートします
from app import create_app

# アプリケーションファクトリを呼び出して、アプリのインスタンスを作成します
app = create_app()

# このファイルがPythonインタプリタによって直接実行された場合にのみ、
# 開発用のWebサーバーを起動します
if __name__ == '__main__':
    app.run(debug=True)