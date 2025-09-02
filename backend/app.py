from flask import Flask

# Flaskアプリケーションを作成
app = Flask(__name__)

# http://127.0.0.1:5000/ というURLにアクセスがあった場合の処理
@app.route('/')
def hello_world():
    return 'Hello, World! 環境構築成功です！'

# このファイルが直接実行された場合にサーバーを起動
if __name__ == '__main__':
    app.run(debug=True)