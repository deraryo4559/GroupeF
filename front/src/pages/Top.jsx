// Top.jsx
import React, { useState, useEffect } from 'react';
import Button1 from '../components/button1';
import Icon from '../components/Icon';
import Header from '../components/Header';
import BalanceCard from '../components/BalanceCard';
import MenuIconButton from '../components/MenuIconButton';
import { SendIcon, RequestIcon, StatusIcon, ProfileIcon, ReceiptIcon } from '../components/MenuIcons';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const Top = () => {
    const location = useLocation();
    const navigate = useNavigate();
  const loginUser = location.state?.user;
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
    const [balance, setBalance] = useState("取得中…"); // 数値型で初期化
    const [userId, setUserId] = useState("");
    const [isLoading, setIsLoading] = useState(true);


    // --- ユーザー情報取得 ---
    useEffect(() => {
        const TARGET_USER_ID = loginUser?.user_id ?? 52;
        setIsLoading(true);

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
                setIsLoading(false); // データ取得完了
            })
            .catch(err => {
                console.error("アカウント情報の取得に失敗:", err);
                setIsLoading(false); // エラー時も読み込み完了扱い
            });
    }, []);

    return (
        <div className="fixed inset-0 overflow-hidden bg-white">
            {/* ヘッダー */}
            <Header title="アカウント" showBackButton={false} />
            <div className="flex justify-center h-[calc(100vh-56px)] overflow-hidden">
                <div className="min-w-[300px] w-full max-w-sm p-6 flex flex-col bg-gray-50">
                    <div className="space-y-4 overflow-hidden">
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
                            balance={isLoading ? 0 : balance} // ローディング中は0を表示
                            label="残高"
                        />

                        {/* 操作メニュー */}
                        <section className="grid grid-cols-2 gap-3">
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
                                onClick={() => window.location.href = '/profile'}
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