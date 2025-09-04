// Profile.jsx
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
    const [userInfo, setUserInfo] = useState({
        name: "読み込み中…",
        email: "読み込み中…",
        avatarPath: "/images/human1.png",
        userId: "",
        accountNumber: "取得中…",
        balance: "取得中…",
        createdAt: "取得中…"
    });
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

useEffect(() => {
    setIsLoading(true);

    // sessionStorage からログインユーザーを取得
    const saved = sessionStorage.getItem("authUser");
    const me = saved ? JSON.parse(saved) : null;
    const TARGET_USER_ID = me?.user_id ?? 52; // 未ログイン時はデフォルト 52

    // ユーザー情報とアカウント情報を並行取得
    Promise.all([
        fetch('http://localhost:5000/api/users/').then(res => res.json()),
        fetch('http://localhost:5000/api/accounts_all/').then(res => res.json())
    ])
    .then(([users, accounts]) => {
        const user = users.find(u => Number(u.user_id) === Number(TARGET_USER_ID));
        const account = accounts.find(a => Number(a.user_id) === Number(TARGET_USER_ID));

        if (user) {
            setUserInfo({
                name: user.name || "ゲストユーザー",
                email: user.email || "guest@example.com",
                avatarPath: user.avatar_path || "/images/human1.png",
                userId: user.user_id,
                accountNumber: account?.account_number || "1234567890",
                balance: account?.balance || 0,
                createdAt: user.created_at || new Date().toISOString()
            });
        }
    })
    .catch(err => {
        console.error("プロフィール情報の取得に失敗:", err);
        // エラー時はデフォルト値を設定
        setUserInfo({
            name: "ゲストユーザー",
            email: "guest@example.com",
            avatarPath: "/images/human1.png",
            userId: TARGET_USER_ID,
            accountNumber: "1234567890",
            balance: 50000,
            createdAt: new Date().toISOString()
        });
    })
    .finally(() => {
        setIsLoading(false);
    });
}, []);


    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return "不明";
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ja-JP', {
            style: 'currency',
            currency: 'JPY'
        }).format(amount);
    };

    return (
        <div className="fixed inset-0 overflow-hidden bg-white">
            {/* ヘッダー */}
            <Header title="プロフィール" showBackButton={true} />
            
            <div className="flex justify-center h-[calc(100vh-56px)] overflow-auto">
                <div className="min-w-[300px] w-full max-w-sm p-6 bg-gray-50">
                    <div className="space-y-6">
                        
                        {/* プロフィール写真・基本情報 */}
                        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-24 w-24"
                                     style={{ backgroundImage: `url(${userInfo.avatarPath})` }}>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{userInfo.name}</h1>
                                    <p className="text-gray-500 text-sm">@user_{userInfo.userId}</p>
                                </div>
                            </div>
                        </section>

                        {/* 基本情報 */}
                        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">基本情報</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-gray-600">氏名</span>
                                    <span className="text-gray-900 font-medium">{userInfo.name}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-gray-600">メールアドレス</span>
                                    <span className="text-gray-900 font-medium text-sm">{userInfo.email}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-gray-600">ユーザーID</span>
                                    <span className="text-gray-900 font-medium">{userInfo.userId}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-600">登録日</span>
                                    <span className="text-gray-900 font-medium">{formatDate(userInfo.createdAt)}</span>
                                </div>
                            </div>
                        </section>

                        {/* アカウント情報 */}
                        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">アカウント情報</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-gray-600">口座番号</span>
                                    <span className="text-gray-900 font-medium font-mono">{userInfo.accountNumber}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-600">現在の残高</span>
                                    <span className="text-green-600 font-bold text-lg">{formatCurrency(userInfo.balance)}</span>
                                </div>
                            </div>
                        </section>

                        {/* アクションボタン */}
                        <section className="space-y-3">
                            <button 
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                                onClick={() => alert('プロフィール編集機能は準備中です')}
                            >
                                プロフィールを編集
                            </button>
                            
                            <Link 
                                to="/"
                                className="block w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium text-center hover:bg-gray-300 transition-colors"
                            >
                                ホームに戻る
                            </Link>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
