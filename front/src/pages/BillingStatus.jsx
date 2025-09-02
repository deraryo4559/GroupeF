import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button1 from '../components/button1';
import BillingInfo from '../components/BillingInfo';
import PayerInfo from '../components/PayerInfo';

const BillingStatus = () => {
    const navigate = useNavigate();

    // 仮のデータ: 実際のアプリケーションではAPIから取得する
    const [billingHistory] = useState([
        {
            id: 1,
            amount: 5000,
            message: "先日の食事代",
            createdAt: "2025-08-30T15:30:00",
            status: "paid",
            paidBy: {
                id: 101,
                name: "鈴木 花子",
                icon: "/images/human2.png"
            }
        },
        {
            id: 2,
            amount: 3000,
            message: "映画のチケット代",
            createdAt: "2025-08-28T10:15:00",
            status: "pending",
            paidBy: null
        },
        {
            id: 3,
            amount: 12000,
            message: "旅行の宿泊費",
            createdAt: "2025-08-25T08:45:00",
            status: "paid",
            paidBy: {
                id: 102,
                name: "佐藤 次郎",
                icon: "/images/human3.png"
            }
        },
        {
            id: 4,
            amount: 2500,
            message: "カフェでの飲み物代",
            createdAt: "2025-08-20T14:20:00",
            status: "pending",
            paidBy: null
        }
    ]);

    // 日付をフォーマット
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    // ステータスに応じたスタイル
    const getStatusStyles = (status) => {
        if (status === 'paid') {
            return {
                label: '支払い済み',
                bgColor: 'bg-green-100',
                textColor: 'text-green-800'
            };
        } else {
            return {
                label: '未払い',
                bgColor: 'bg-yellow-100',
                textColor: 'text-yellow-800'
            };
        }
    };

    return (
        <div className="bg-white min-h-screen p-4 font-sans">
            <div className="max-w-md mx-auto">
                {/* ヘッダー */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">請求ステータス</h1>
                </div>

                {/* リスト */}
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    {billingHistory.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {billingHistory.map((billing) => {
                                const statusStyle = getStatusStyles(billing.status);

                                return (
                                    <li key={billing.id} className="p-4">
                                        <div className="flex justify-between items-start">
                                            {/* 請求情報 */}
                                            <BillingInfo
                                                billing={billing}
                                                formatDate={formatDate}
                                                statusStyle={statusStyle}
                                            />

                                            {/* 支払いユーザー情報（支払い済みのときだけ） */}
                                            {billing.status === 'paid' && (
                                                <PayerInfo
                                                    payer={billing.paidBy}
                                                    className="ml-4"
                                                />
                                            )}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            請求履歴がありません
                        </div>
                    )}
                </div>

                <div className="mt-6">
                    <Button1
                        onClick={() => navigate('/')}
                        variant="primary"
                        className="w-full"
                    >
                        ホームに戻る
                    </Button1>
                </div>
            </div>
        </div>
    );
};

export default BillingStatus;
