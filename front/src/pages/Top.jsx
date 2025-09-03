import React, { useState, useEffect } from 'react';
import Button1 from '../components/button1';
import Icon from '../components/Icon';
import Header from '../components/Header';
import Balance from '../components/Balance';
import { Link } from 'react-router-dom';

const Top = () => {
    const [balance, setBalance] = useState(50000); // 初期残高50,000円

    // ローカルストレージから残高を読み込み
    useEffect(() => {
        const savedBalance = localStorage.getItem('userBalance');
        if (savedBalance) {
            setBalance(Number(savedBalance));
        } else {
            localStorage.setItem('userBalance', '50000');
        }
    }, []);

    return (
        <div className="relative flex size-full min-h-screen flex-col overflow-x-hidden bg-gray-50">
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
                <section className="bg-gradient-to-r from-red-500 to-red-400 p-6 rounded-2xl shadow-sm text-white">
                    <div className="flex justify-between items-center">
                        <h2 className="text-white text-sm font-medium">残高</h2>
                    </div>
                    <p className="text-white text-4xl font-bold mt-2">¥{balance.toLocaleString()}</p>
                </section>

                {/* 操作メニュー */}
                <section className="grid grid-cols-2 gap-4">
                    <button onClick={() => window.location.href = '/step3'}
                        className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white p-4 text-center shadow-sm border border-gray-100">
                        <div className="grid place-content-center bg-red-100 text-red-600 rounded-full size-12">
                            <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L192.69,140H40a8,8,0,0,1,0-16H192.69L138.34,69.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path>
                            </svg>
                        </div>
                        <span className="text-gray-800 text-sm font-semibold">送金する</span>
                    </button>

                    <button onClick={() => window.location.href = '/request'}
                        className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white p-4 text-center shadow-sm border border-gray-100">
                        <div className="grid place-content-center bg-blue-100 text-blue-600 rounded-full size-12">
                            <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M34.34,122.34l72-72a8,8,0,0,1,11.32,11.32L63.31,116H216a8,8,0,0,1,0,16H63.31l54.35,54.34a8,8,0,0,1-11.32,11.32l-72-72A8,8,0,0,1,34.34,122.34Z"></path>
                            </svg>
                        </div>
                        <span className="text-gray-800 text-sm font-semibold">請求する</span>
                    </button>

                    <button onClick={() => window.location.href = '/billing-status'}
                        className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white p-4 text-center shadow-sm border border-gray-100">
                        <div className="grid place-content-center bg-green-100 text-green-600 rounded-full size-12">
                            <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128ZM128,72a8,8,0,0,0-8,8v40a8,8,0,0,0,8,8h24a8,8,0,0,0,0-16H136V80A8,8,0,0,0,128,72Zm-8,88a12,12,0,1,0,12,12A12,12,0,0,0,120,160Z"></path>
                            </svg>
                        </div>
                        <span className="text-gray-800 text-sm font-semibold">請求ステータス</span>
                    </button>

                    <button onClick={() => alert('')}
                        className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white p-4 text-center shadow-sm border border-gray-100">
                        <div className="grid place-content-center bg-purple-100 text-purple-600 rounded-full size-12">
                            <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M218.1,70.18a8,8,0,0,0-8.2,1.94L136,121.43V40a8,8,0,0,0-16,0v81.43L46.1,72.12a8,8,0,0,0-12.2,10.24l80,104a8,8,0,0,0,12.2,0l80-104A8,8,0,0,0,218.1,70.18Z"></path>
                            </svg>
                        </div>
                        <span className="text-gray-800 text-sm font-semibold">XXXX</span>
                    </button>
                </section>
            </main>
        </div>
    );
};

export default Top;
