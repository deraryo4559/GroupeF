// Top.jsx
import React, { useState, useEffect } from 'react';
import Button1 from '../components/button1';
import Icon from '../components/Icon';
import Header from '../components/Header';
import BalanceCard from '../components/BalanceCard';
import MenuIconButton from '../components/MenuIconButton';
import { SendIcon, RequestIcon, StatusIcon, ProfileIcon, ReceiptIcon } from '../components/MenuIcons';
import { Link } from 'react-router-dom';

const Top = () => {
  const [userName, setUserName] = useState("読み込み中…");
  const [avatarPath, setAvatarPath] = useState("/images/human1.png");
  const [accountNumber, setAccountNumber] = useState("取得中…");
  const [balance, setBalance] = useState("取得中…");
  const [userId, setUserId] = useState("");


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
            setUserId(user1.user_id);
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
            // 口座番号を表示用に加工（最後の4桁だけ表示）
            const maskedNumber = acc1.account_number ? 
              `***${acc1.account_number.slice(-4)}` : 
              "***1234";
            
            setAccountNumber(maskedNumber);
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
    <div className="flex justify-center min-h-screen bg-white">
      <div className="max-w-sm w-full flex flex-col">
        {/* ヘッダー */}
        <Header title="アカウント" showBackButton={false} />

        {/* メインコンテンツ - 背景グレーの範囲 */}
        <main className="flex-grow bg-gray-50 p-6">
          <div className="space-y-6">
            {/* ユーザー情報 */}
            <section className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-20 w-20 shrink-0"
                style={{ backgroundImage: `url(${avatarPath})` }}>
              </div>
              <div>
                <p className="text-gray-900 text-xl font-bold leading-tight">{userName}</p>
                <p className="text-gray-500 text-sm">@user_{userId || "sample"}</p>
                <p className="text-gray-500 text-sm">口座番号: {accountNumber}</p>
              </div>
            </section>

            {/* 残高表示 */}
            <BalanceCard
              balance={balance}
              label="残高"
            />

            {/* 操作メニュー */}
            <section className="grid grid-cols-2 gap-4">
              <MenuIconButton
                label="送金する"
                icon={<SendIcon />}
                bgColor="bg-red-100"
                textColor="text-red-600"
                onClick={() => window.location.href = '/step3'}
              />

              <MenuIconButton
                label="請求する"
                icon={<RequestIcon />}
                bgColor="bg-gray-200"
                textColor="text-gray-600"
                onClick={() => window.location.href = '/request'}
              />

              <MenuIconButton
                label="請求ステータス"
                icon={<ReceiptIcon />}
                bgColor="bg-gray-200"
                textColor="text-gray-600"
                onClick={() => window.location.href = '/billing-status'}
              />

              <MenuIconButton
                label="プロフィール"
                icon={<ProfileIcon />}
                bgColor="bg-gray-200"
                textColor="text-gray-600"
                onClick={() => alert('準備中')}
              />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Top;