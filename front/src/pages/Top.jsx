// Top.jsx
import React, { useState, useEffect } from 'react';
import Button1 from '../components/button1';
import Icon from '../components/Icon';
import Header from '../components/Header';
import Balance from '../components/Balance';

const Top = () => {
  const [userName, setUserName] = useState("読み込み中…");
  const [avatarPath, setAvatarPath] = useState("/images/human1.png");
  const [accountNumber, setAccountNumber] = useState("取得中…");
  const [balance, setBalance] = useState("取得中…");


  // --- ユーザー情報取得 ---
  useEffect(() => {
  const TARGET_USER_ID = 52;

  // --- ユーザー情報取得 ---
  fetch('http://localhost:5000/api/users/')   // ← 末尾スラッシュありを推奨
    .then(response => {
      if (!response.ok) throw new Error('ユーザーデータの取得に失敗しました');
      return response.json();
    })
    .then(data => {
      if (Array.isArray(data)) {
        // 文字列/数値どちらでもヒットするように Number() で比較
        const user1 = data.find(u => Number(u.user_id) === Number(TARGET_USER_ID));
        if (user1) {
          setUserName(user1.name);
          setAvatarPath(user1.avatar_path || "/images/human1.png");
        }
      }
    })
    .catch(err => {
      console.error("ユーザー情報の取得に失敗:", err);
    });

  // --- アカウント情報取得 ---
  fetch('http://localhost:5000/api/accounts_all/')  // ← 末尾スラッシュあり
    .then(response => {
      if (!response.ok) throw new Error('アカウントデータの取得に失敗しました');
      return response.json();
    })
    .then(data => {
      if (Array.isArray(data)) {
        const acc1 = data.find(a => Number(a.user_id) === Number(TARGET_USER_ID));
        if (acc1) {
          setAccountNumber(acc1.account_number);
          // Balance は数値前提なので数値に直してからセット
          setBalance(Number(acc1.balance));
        }
      }
    })
    .catch(err => {
      console.error("アカウント情報の取得に失敗:", err);
    });
    }, []);

    return (
        <>
            <Header title="ホーム" showBackButton={false} />
            <div className="flex justify-center h-screen">
                <div className="min-w-[300px] w-full max-w-sm p-6 flex flex-col justify-center">
                    <div className='h-[50%]'>
                        <h2 className="text-xl font-bold text-gray-800 mb-6">
                            お客様情報
                        </h2>
                        <Icon
                            img={avatarPath}
                            name={userName}
                        />

                        {/* 口座番号表示 */}
                        <div className="mt-4 mb-4">
                            <p className="text-sm text-gray-600">口座番号：{accountNumber}</p>
                        </div>

                        {/* 預金残高（コンポーネント化済み） */}
                        <div className='mt-4'>
                            <Balance balance={balance} />
                        </div>
                    </div>
                    <div className='h-[50%]'>
                        <div className="mt-5 flex justify-center">
                            <Button1 navigateTo="/step3" className="w-full">
                                送金する
                            </Button1>
                        </div>
                        <div className="mt-10 flex justify-center">
                            <Button1 navigateTo="/request" className="w-full" variant='danger'>
                                請求する
                            </Button1>
                        </div>
                        <div className="mt-10 flex justify-center">
                            <Button1 navigateTo="/billing-status" className="w-full" variant='secondary'>
                                請求ステータス
                            </Button1>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Top;
