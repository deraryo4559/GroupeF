import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button1 from '../components/button1';
import Header from '../components/Header';
import Balance from '../components/Balance';
import Icon from '../components/Icon';

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
            <div className="pt-16 flex justify-center">
                <div className="max-w-sm w-full p-6 flex flex-col justify-center">
                    <h2 className="text-xl font-bold text-center text-gray-800 mb-6">
                        支払う
                    </h2>
                    <Icon img="/images/human1.png" name="サンプル氏名" />

                    <div>
                        {/* Balance コンポーネントで残高表示 */}
                        <Balance balance={balance} label="現在の残高" highlight />

                        {/* メッセージ */}
                        <div className="mt-6">
                            <div className="text-sm text-gray-600 leading-6 mb-2">
                                メッセージ
                            </div>
                            <textarea
                                rows={3}
                                value={reqMsg}
                                readOnly
                                className="w-full pl-4 pr-4 py-3 text-[15px] md:text-base rounded-xl border border-gray-300 bg-white placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none"
                            />
                        </div>

                        {/* Balance コンポーネントで支払額表示 */}
                        <Balance balance={paymentAmount} label="支払額" />
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
        </>
    );
};

export default Payment;
