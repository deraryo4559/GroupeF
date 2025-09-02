import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button1 from '../components/button1';
import Header from '../components/Header';

const Payment = () => {
    const navigate = useNavigate();
    const [balance, setBalance] = useState(50000);
    const paymentAmount = 50000;
    const reqMsg = "飲み会代お願いします！";

    useEffect(() => {
        const savedBalance = localStorage.getItem('userBalance');
        if (savedBalance) {
            setBalance(Number(savedBalance));
        }
    }, []);

    const handlePayment = () => {
        if (balance >= paymentAmount) {
            const newBalance = balance - paymentAmount;
            setBalance(newBalance);
            localStorage.setItem('userBalance', newBalance.toString());
            navigate('/payment/complete');
        } else {
            alert('残高が不足しています。');
        }
    };

    return (
        <>
            <Header title="支払い" backTo="/billing-status" />
            <div className="min-h-screen pt-16 px-4 pb-8 bg-gray-50">
                <div className="max-w-md mx-auto">
                    {/* 送金相手 */}
                    <div className="bg-white rounded-2xl shadow-sm p-5 mb-5">
                        <h2 className="text-lg font-semibold mb-4 text-gray-800">支払い相手</h2>
                        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                            <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
                                <img
                                    src="/images/human1.png"
                                    alt="サンプル氏名"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <div className="font-medium text-base text-gray-900">
                                    サンプル氏名
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 請求情報 */}
                    <div className="bg-white rounded-2xl shadow-sm p-5 mb-5">
                        <h2 className="text-lg font-semibold mb-4 text-gray-800">請求内容</h2>
                        
                        {/* メッセージ */}
                        <div className="mb-5">
                            <div className="text-sm text-gray-600 mb-2">
                                メッセージ
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl text-gray-800 text-sm">
                                {reqMsg}
                            </div>
                        </div>

                        {/* 支払額 */}
                        <div className="border-t border-gray-100 pt-4">
                            <div className="text-sm text-gray-600 mb-1">支払額</div>
                            <div className="text-2xl font-bold text-red-600">
                                {paymentAmount.toLocaleString()}円
                            </div>
                        </div>
                    </div>

                    {/* 残高情報 */}
                    <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
                        <h2 className="text-lg font-semibold mb-4 text-gray-800">残高情報</h2>
                        <div className="flex justify-between items-center">
                            <div className="text-gray-600">現在の残高</div>
                            <div className="text-xl font-semibold text-green-600">
                                {balance.toLocaleString()}円
                            </div>
                        </div>
                        
                        {/* 支払い後の残高 */}
                        {balance >= paymentAmount && (
                            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                                <div className="text-gray-600">支払い後の残高</div>
                                <div className="text-lg font-semibold text-gray-700">
                                    {(balance - paymentAmount).toLocaleString()}円
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 支払いボタン */}
                    <div className="px-2">
                        <Button1 
                            onClick={handlePayment}
                            className="w-full py-4 rounded-xl text-base font-medium shadow-md transition-all"
                            disabled={balance < paymentAmount}
                            variant={balance < paymentAmount ? 'secondary' : 'primary'}
                        >
                            {balance < paymentAmount ? '残高不足' : `${paymentAmount.toLocaleString()}円を支払う`}
                        </Button1>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Payment;
