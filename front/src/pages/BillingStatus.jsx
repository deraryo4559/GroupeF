// src/pages/BillingStatus.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button1 from '../components/button1';
import BillingInfo from '../components/BillingInfo';
import PayerInfo from '../components/PayerInfo';
import Header from '../components/Header';

const BillingStatus = () => {
  const navigate = useNavigate();

  const [billingHistory, setBillingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('authUser');
    const me = saved ? JSON.parse(saved) : null;
    const requester_user_id = me?.user_id ?? 52;

    fetch(`http://localhost:5000/api/requests/?requester_user_id=${requester_user_id}`)
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!res.ok || !data?.ok) {
          throw new Error(data?.message || `Failed: ${res.status}`);
        }
        const mapped = data.items.map((r) => ({
          id: r.id,
          amount: r.amount,
          message: r.message || '',
          createdAt: r.created_at,
          status:
            r.status === 'success'
              ? 'paid'
              : r.status === 'canceled'
              ? 'canceled'
              : 'pending',
          paidBy: null,
        }));
        setBillingHistory(mapped);
        setLoading(false);
      })
      .catch((err) => {
        console.error('請求一覧の取得に失敗:', err);
        setError('請求一覧の取得に失敗しました');
        setLoading(false);
      });
  }, []);

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

  // ステータスに応じたスタイル（既存のまま）
  const getStatusStyles = (status) => {
    if (status === 'paid') {
      return {
        label: '支払い済み',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
      };
    } else if (status === 'canceled') {
        return {
          label: 'キャンセル済み',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
        };
    }
    else {
      return {
        label: '未払い',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
      };
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-white">
      <Header title="請求ステータス" backTo="/" />
      <div className="flex justify-center h-[calc(100vh-56px)] overflow-hidden">
        <div className="min-w-[300px] w-full max-w-sm p-6 flex flex-col bg-gray-50">
          <div className="space-y-4 overflow-hidden">
            <section className="bg-white rounded-xl shadow-sm p-4 overflow-hidden">
              {loading ? (
                <div className="p-8 text-center text-gray-500">読み込み中…</div>
              ) : error ? (
                <div className="p-8 text-center text-red-600">{error}</div>
              ) : billingHistory.length > 0 ? (
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

                          <div className="flex flex-col items-end space-y-2 ml-4">
                          {/* 支払いユーザー情報（支払い済みのときだけ） */}
                            {billing.status === 'paid' && billing.paidBy && (
                              <PayerInfo
                                payer={billing.paidBy}
                                className="ml-4"
                                size="sm"
                                align="left"
                                labelText="支払者"
                              />
                            )}

                          {/* 未払いなら「請求取り下げ」ボタンを表示 */}
                            {billing.status === 'pending' && (
                              <button
                                onClick={async () => {
                                  try {
                                  const res = await fetch(`http://localhost:5000/api/requests/${billing.id}/cancel`, {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                });
                                    const data = await res.json();
                                    if (!res.ok || !data.ok) {
                                      alert("取り下げに失敗しました");
                                      return;
                                    }
                                  // 状態を即座に更新
                                    setBillingHistory((prev) =>
                                      prev.map((b) =>
                                      b.id === billing.id ? { ...b, status: "canceled" } : b
                                      )
                                    );
                                  } catch (err) {
                                  console.error("通信エラー:", err);
                                  alert("通信エラーが発生しました");
                                  }
                                }}
                                className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                              >
                                請求取り下げ
                              </button>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="p-8 text-center text-gray-500">請求履歴がありません</div>
              )}
            </section>

          <div className="mt-6">
              <Button1 onClick={() => navigate('/')} variant="primary" className="w-full">
                ホームに戻る
              </Button1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingStatus;
