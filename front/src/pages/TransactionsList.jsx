// src/pages/TransactionsList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button1 from '../components/button1';
import BillingInfo from '../components/BillingInfo';
import PayerInfo from '../components/PayerInfo';
import Header from '../components/Header';

const TransactionsList = () => {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ▼ ダミーデータ（transactions テーブルの構成に合わせたキー）
    const dummy = [
      {
        id: 55555,
        sender_account_id: 98765,
        receiver_account_id: 87654,
        amount: 12500,
        currency: 'JPY',
        message: '給与振込（8月分）',
        status: 'completed',
        transaction_type: 'deposit',
        created_at: '2025-08-30T09:15:00',
      },
      {
        id: 55556,
        sender_account_id: 98765,
        receiver_account_id: 87654,
        amount: 3200,
        currency: 'JPY',
        message: 'コンビニ支払い',
        status: 'completed',
        transaction_type: 'withdrawal',
        created_at: '2025-08-29T21:10:00',
      },
      {
        id: 55557,
        sender_account_id: 98765,
        receiver_account_id: 87654,
        amount: 5000,
        currency: 'JPY',
        message: '送金：佐藤 次郎さんへ',
        status: 'pending',
        transaction_type: 'transfer',
        created_at: '2025-08-28T19:40:00',
      },
      {
        id: 55558,
        sender_account_id: 98765,
        receiver_account_id: 87654,
        amount: 2400,
        currency: 'JPY',
        message: '立替返金（友人）',
        status: 'completed',
        transaction_type: 'deposit',
        created_at: '2025-08-27T13:25:00',
      },
    ];

    setTransactions(dummy);
    setLoading(false);
  }, []);

  // 日付フォーマット
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // ステータス/種類に応じたスタイル
  const getStatusStyles = (tx) => {
    if (tx.transaction_type === 'deposit') {
      return {
        label: '入金',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
      };
    } else if (tx.transaction_type === 'withdrawal') {
      return {
        label: '出金',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
      };
    } else {
      // transfer
      return {
        label: tx.status === 'completed' ? '送金済み' : '送金中',
        bgColor: tx.status === 'completed' ? 'bg-blue-100' : 'bg-gray-100',
        textColor: tx.status === 'completed' ? 'text-blue-800' : 'text-gray-800',
      };
    }
  };

  return (
    <>
      <Header title="取引履歴" backTo="/" />
      <div className="min-h-screen pt-20 px-4 pb-8 bg-gray-50">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-4 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-500">読み込み中…</div>
            ) : error ? (
              <div className="p-8 text-center text-red-600">{error}</div>
            ) : transactions.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {transactions.map((tx) => {
                  const statusStyle = getStatusStyles(tx);
                  return (
                    <li key={tx.id} className="p-4">
                      <div className="flex justify-between items-start">
                        {/* 取引情報 */}
                        <BillingInfo
                          billing={{
                            id: tx.id,
                            amount: tx.amount,
                            message: tx.message,
                            createdAt: tx.created_at,
                          }}
                          formatDate={formatDate}
                          statusStyle={statusStyle}
                        />

                        {/* 相手情報（transfer の場合に相手口座を表示したいならここに PayerInfo を追加可能） */}
                        {tx.transaction_type === 'transfer' && (
                          <PayerInfo
                            payer={{
                              id: tx.receiver_account_id,
                              name: `口座ID: ${tx.receiver_account_id}`,
                              icon: '/images/human2.png',
                            }}
                            className="ml-4"
                            size="sm"
                            align="left"
                            labelText="送金先"
                          />
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="p-8 text-center text-gray-500">取引履歴がありません</div>
            )}
          </div>

          <div className="mt-6">
            <Button1 onClick={() => navigate('/')} variant="primary" className="w-full">
              ホームに戻る
            </Button1>
          </div>
        </div>
      </div>
    </>
  );
};

export default TransactionsList;
