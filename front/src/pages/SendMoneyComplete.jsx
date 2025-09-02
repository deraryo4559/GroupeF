import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button1 from '../components/button1';

const SendMoneyComplete = () => {
    const navigate = useNavigate();

    const handleBackToHome = () => {
        navigate('/');
    };

    return (
        <div className="flex justify-center min-h-screen p-4 font-sans">
            <div className="max-w-sm w-full bg-white rounded-xl p-6 flex  justify-center flex-col items-center">
                {/* 完了アイコン */}
                <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6">
                    <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>

                {/* 完了メッセージ */}
                <h1 className="text-2xl font-bold text-gray-800 mb-3">送金完了</h1>
                <p className="text-gray-600 text-center mb-8">
                    送金処理が正常に完了しました
                </p>

                {/* ホームに戻る */}
                <Button1 navigateTo="/" className="w-full">
                    ホームに戻る
                </Button1>
            </div>
        </div>
    );
};

export default SendMoneyComplete;