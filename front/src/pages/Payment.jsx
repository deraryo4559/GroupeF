import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button1 from '../components/button1';
import Icon from '../components/Icon';
import Header from '../components/Header';

const Payment = () => {
    const navigate = useNavigate();
    const [balance, setBalance] = useState(50000); // 初期残高50,000円
    const paymentAmount = 50000; // 支払額
    const reqMsg = "飲み会代お願いします！";

    // ローカルストレージから残高を読み込み
    useEffect(() => {
        const savedBalance = localStorage.getItem('userBalance');
        if (savedBalance) {
            setBalance(Number(savedBalance));
        }
    }, []);

    // 支払い処理
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
            <Header title="送金依頼" showBackButton={false} />
            <div className="flex justify-center">
                <div className="max-w-sm w-full p-6 flex flex-col justify-center">
                    <div>
                        <h2 className="text-xl font-bold text-center text-gray-800 mb-6">
                            支払う
                        </h2>
                        <Icon
                            img="\images\human1.png"
                            name="サンプル氏名"
                        />
                        <div>
                            {/* 現在の残高表示 */}
                            <div className="mb-4">
                                <p className="text-sm text-gray-600">現在の残高</p>
                                <p className="text-lg font-semibold text-green-600 flex justify-end">
                                    {balance.toLocaleString()}円
                                </p>
                            </div>


                            <div className="mt-6">
                                <div className="text-sm text-gray-600 leading-6 mb-2">メッセージ（任意）</div>
                                <textarea
                                    rows={3}
                                    value={reqMsg}
                                    className="w-full pl-4 pr-4 py-3 text-[15px] md:text-base rounded-xl border border-gray-300 bg-white placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none"
                                />
                            </div>

                            {/* 支払額表示 */}
                            <div>
                                <p className="text-sm text-gray-600">支払額</p>
                                <p className="text-2xl font-bold text-gray-900 flex justify-end">{paymentAmount.toLocaleString()}円</p>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-center">
                            <Button1
                                onClick={handlePayment}
                                className="w-full"
                                disabled={balance < paymentAmount}
                            >
                                {balance < paymentAmount ? '残高不足' : '支払う'}
                            </Button1>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default Payment;