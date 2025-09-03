import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button1 from '../components/button1';
import Header from '../components/Header';

const PaymentComplete = () => {
    const navigate = useNavigate();

    return (
        <>
            <Header title="支払い完了" backTo="/payment" />
            <div className="min-h-screen pt-20 px-4 pb-8 bg-gray-50">
                <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-sm p-6">
                    {/* 完了アイコン */}
                    <div className="mb-6 flex justify-center">
                        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                    </div>

                    {/* 完了メッセージ */}
                    <h1 className="text-xl font-bold text-center mb-3">支払い完了</h1>
                    <p className="text-gray-600 text-center mb-8">
                        支払いが正常に完了しました
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

export default PaymentComplete;