// Top.jsx
import React, { useState, useEffect } from 'react';
import Button1 from '../components/button1';
import Icon from '../components/Icon';
import Balance from '../components/Balance';

const Top = () => {
  const [userName, setUserName] = useState("読み込み中…");
  const [avatarPath, setAvatarPath] = useState("/images/human1.png");
  const [accountNumber, setAccountNumber] = useState("取得中…");
  const [balance, setBalance] = useState("取得中…");

  useEffect(() => {
    // user_id=1 のユーザー情報
    // 全件取得ではなく、IDを指定して直接取得する！
    fetch("http://localhost:5000/api/users/1")
      .then(res => res.json())
      .then(user1 => { // 受け取るデータは単一のuserオブジェクト
        if (user1) {
          setUserName(user1.name);
          setAvatarPath(user1.avatar_path || "/images/human1.png");
        }
      });

    // user_id=1 のアカウント情報 (こちらは元から正しい)
    fetch("http://localhost:5000/api/accounts/1")
      .then(res => res.json())
      .then(acc => {
        if (!acc.error) {
          setAccountNumber(acc.account_number);
          setBalance(acc.balance);
        }
      });
  }, []);

  return (
    <div className="flex justify-center">
      <div className="max-w-sm w-full p-6 flex flex-col justify-center">
        <div>
          <h2 className="text-xl font-bold text-center text-gray-800 mb-6">
            お客様情報
          </h2>
          <Icon img={avatarPath} name={userName} />
          <div>
            {/* 口座番号表示 */}
            <div className="mb-4">
              <p className="text-sm text-gray-600">口座番号：{accountNumber}</p>
            </div>
            {/* 預金残高 */}
            <Balance balance={balance} />
          </div>
          <div className="mt-6 flex justify-center">
            <Button1 navigateTo="/step3" className="w-full">送金する</Button1>
          </div>
          <div className="mt-6 flex justify-center">
            <Button1 navigateTo="/request" className="w-full" variant="danger">請求する</Button1>
          </div>
          <div className="mt-6 flex justify-center">
            <Button1 navigateTo="/billing-status" className="w-full" variant="secondary">請求ステータス</Button1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Top;
