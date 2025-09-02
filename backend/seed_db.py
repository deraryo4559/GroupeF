import sqlite3
import random

# データベースファイルに接続します
connection = sqlite3.connect('app/money_app.db')
cursor = connection.cursor()

try:
    # --- 1. usersテーブルへのデータ挿入 ---
    users_to_insert = []
    names = [
        '佐藤 太郎', '鈴木 一郎', '高橋 花子', '田中 さくら', '伊藤 健太',
        '渡辺 由美', '山本 裕子', '中村 大輔', '小林 美咲', '加藤 涼子'
    ]
    for i, name in enumerate(names, 1):
        user = (
            name,
            f'test{i}@example.com',
            f'hashed_password_{i}'
        )
        users_to_insert.append(user)

    cursor.executemany(
        'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
        users_to_insert
    )
    print(f"{len(users_to_insert)}人分のテストユーザーデータを挿入しました。")

    # --- 2. accountsテーブルへのデータ挿入 ---
    # 先ほど挿入したユーザーのuser_idを取得します
    cursor.execute('SELECT user_id FROM users ORDER BY user_id')
    user_ids = [row[0] for row in cursor.fetchall()]

    accounts_to_insert = []
    for user_id in user_ids:
        account = (
            user_id,
            # ランダムな口座番号を生成
            f'{random.randint(100, 999)}-{random.randint(100000, 999999)}',
            random.randint(50000, 500000) # 5万〜50万のランダムな残高
        )
        accounts_to_insert.append(account)

    cursor.executemany(
        'INSERT INTO accounts (user_id, account_number, balance) VALUES (?, ?, ?)',
        accounts_to_insert
    )
    print(f"{len(accounts_to_insert)}件のテスト口座データを挿入しました。")

except sqlite3.IntegrityError:
    # UNIQUE制約違反の場合（データが既に存在する場合）
    print("テストデータは既に存在しているため、挿入をスキップしました。")
finally:
    # データベースへの変更を確定（保存）し、接続を閉じます
    connection.commit()
    connection.close()

