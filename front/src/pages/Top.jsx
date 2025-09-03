import React, { useState, useEffect } from 'react';
import Button1 from '../components/button1';
import Icon from '../components/Icon';
import Header from '../components/Header';
import BalanceCard from '../components/BalanceCard';
import MenuIconButton from '../components/MenuIconButton';
import { SendIcon, RequestIcon, StatusIcon, ProfileIcon, ReceiptIcon } from '../components/MenuIcons';
import { Link } from 'react-router-dom';

const Top = () => {
    const [balance, setBalance] = useState(10000);

    // ローカルストレージから残高を読み込み
    useEffect(() => {
        const savedBalance = localStorage.getItem('userBalance');
        if (savedBalance) {
            setBalance(Number(savedBalance));
        } else {
            localStorage.setItem('userBalance', balance.toString());
        }
    }, []);

    return (
        <div className="flex justify-center">
            <div className="max-w-sm w-full p-6 flex flex-col justify-center bg-gray-50">

                {/* ヘッダー */}
                <Header title="アカウント" showBackButton={false} />

                {/* メインコンテンツ */}
                <main className="p-4 space-y-6 flex-grow">
                    {/* ユーザー情報 */}
                    <section className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-20 w-20 shrink-0"
                            style={{ backgroundImage: `url("/images/human1.png")` }}>
                        </div>
                        <div>
                            <p className="text-gray-900 text-xl font-bold leading-tight">サンプル氏名</p>
                            <p className="text-gray-500 text-sm">@sample_user</p>
                            <p className="text-gray-500 text-sm">口座番号: ***1234</p>
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
                </main>
            </div>
        </div>
    );
};

export default Top;
