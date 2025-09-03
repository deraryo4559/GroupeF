import React, { useState, useEffect } from 'react';
import Button1 from '../components/button1';
import Icon from '../components/Icon';
import Header from '../components/Header';
import BalanceCard from '../components/BalanceCard';
import MenuIconButton from '../components/MenuIconButton';
import UserInfoCard from '../components/UserInfoCard';
import { SendIcon, RequestIcon, StatusIcon, ProfileIcon, ReceiptIcon } from '../components/MenuIcons';
import { useNavigate, useLocation } from 'react-router-dom';

const Top = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 🔹 sessionStorage から先に読む
  const saved = sessionStorage.getItem("authUser");
  const savedUser = saved ? JSON.parse(saved) : null;

  // 🔹 location.state にユーザーがあれば上書き
  const loginUser = location.state?.user || savedUser;

  useEffect(() => {
    if (loginUser) {
      sessionStorage.setItem("authUser", JSON.stringify(loginUser));
    }
  }, [loginUser]);

  // ログアウト機能
  const handleLogout = () => {
    sessionStorage.removeItem("authUser");
    navigate("/auth");
  };

  const [userName, setUserName] = useState("読み込み中…");
  const [avatarPath, setAvatarPath] = useState("/images/human1.png");
  const [accountNumber, setAccountNumber] = useState("取得中…");
  const [balance, setBalance] = useState("取得中…");
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // --- ユーザー情報取得 ---
  useEffect(() => {
    if (!loginUser) return; // 未ログインなら処理しない

    const TARGET_USER_ID = loginUser.user_id;
    setIsLoading(true);

    Promise.all([
      fetch("http://localhost:5000/api/users/").then((res) => res.json()),
      fetch("http://localhost:5000/api/accounts_all/").then((res) => res.json()),
    ])
      .then(([users, accounts]) => {
        // --- ユーザー情報 ---
        const u = users.find((u) => Number(u.user_id) === Number(TARGET_USER_ID));
        if (u) {
          setUserName(u.name);
          setAvatarPath(u.avatar_path || "/images/human1.png");
          setUserId(u.user_id);
        }

        // --- アカウント情報 ---
        const acc = accounts.find((a) => Number(a.user_id) === Number(TARGET_USER_ID));
        if (acc) {
          const maskedNumber = acc.account_number
            ? `***${acc.account_number.slice(-4)}`
            : "***1234";
          setAccountNumber(maskedNumber);
          setBalance(Number(acc.balance) || 0);
        }
      })
      .catch((err) => {
        console.error("ユーザー/アカウント情報の取得に失敗:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [loginUser]);


    return (
        <div className="fixed inset-0 overflow-hidden bg-white">
            {/* ヘッダー */}
            <Header title="アカウント" showBackButton={false} />
            <div className="flex justify-center h-[calc(100vh-56px)] overflow-hidden">
                <div className="min-w-[300px] w-full max-w-sm p-6 flex flex-col bg-gray-50">
                    <div className="space-y-4 overflow-hidden">
                        {/* ユーザー情報 */}
                        <UserInfoCard
                            userName={userName}
                            userId={userId}
                            accountNumber={accountNumber}
                            avatarPath={avatarPath}
                        />

                        {/* 残高表示 */}
                        <BalanceCard
                            balance={balance} // ローディング中は0を表示
                            label="残高"
                        />

                        {/* 操作メニュー */}
                        <section className="grid grid-cols-2 gap-3">
                            <MenuIconButton
                                label="送金する"
                                icon={<SendIcon />}
                                bgColor="bg-red-100"
                                textColor="text-red-600"
                                onClick={() => navigate('/step3')}
                            />

                            <MenuIconButton
                                label="請求する"
                                icon={<RequestIcon />}
                                bgColor="bg-gray-200"
                                textColor="text-gray-600"
                                onClick={() => navigate('/request')}
                            />

                            <MenuIconButton
                                label="請求ステータス"
                                icon={<ReceiptIcon />}
                                bgColor="bg-gray-200"
                                textColor="text-gray-600"
                                onClick={() => navigate('/billing-status')}
                            />

                            <MenuIconButton
                                label="プロフィール"
                                icon={<ProfileIcon />}
                                bgColor="bg-gray-200"
                                textColor="text-gray-600"
                                onClick={() => navigate('/profile')}
                            />
                        </section>

                        {/* ログアウトボタン */}
                        <div className="mt-6">
                            <button
                                onClick={handleLogout}
                                className="w-full py-3 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                            >
                                ログアウト
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Top;