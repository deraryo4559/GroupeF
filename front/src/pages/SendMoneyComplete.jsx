import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button1 from '../components/button1';
import Header from '../components/Header';

const SendMoneyComplete = () => {
    const navigate = useNavigate();

    const handleBackToHome = () => {
        navigate('/');
    };

    return (
        <>
            <Header title="送金" />
            <div className="flex justify-center h-screen">
                <div className="min-w-[300px] w-full max-w-sm pl-6 pr-6 flex flex-col items-center justify-center bg-gray-50">
                    {/* 完了アイコン */}
                    <div className="h-[25%] mb-6 flex justify-center items-center">
                        {/* アイコン全体のサイズはここで調整 (例: w-28 h-28) */}
                        <div className="w-40 h-40">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* 背景の円 (緑色) */}
                                <circle cx="12" cy="12" r="11" className="fill-green-500" />
                                {/* チェックマークの線 (白色) */}
                                <path
                                    d="M7 13l3 3 7-7"
                                    className="stroke-white"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                    </div>
                    {/* 完了メッセージ */}
                    <h1 className="text-xl font-bold text-center mb-3">完了</h1>
                    <p className="text-gray-600 text-center mb-8">
                        送金処理が正常に行われました
                    </p>

                    {/* ホームに戻る */}
                    <Button1 navigateTo="/" className="w-full">
                        ホームに戻る
                    </Button1>
                </div>
            </div>
        </>
    );
};

export default SendMoneyComplete;