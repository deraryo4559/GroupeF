// src/pages/TransactionsList.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button1 from '../components/button1';
import BillingInfo from '../components/BillingInfo';
import PayerInfo from '../components/PayerInfo';
import Header from '../components/Header';

const TransactionsList = () => {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [myAccountId, setMyAccountId]   = useState(null);
  const [loading, setLoading]           = useState(true);
  const [error,   setError]             = useState(null);

  // 口座ID -> { name, avatar_path } の簡易キャッシュ
  const [people, setPeople]     = useState({});
  const [accIndex, setAccIndex] = useState(null); // { [account_id]: user_id }
  const [userIndex, setUserIndex] = useState(null); // { [user_id]: {name, avatar_path} }

  useEffect(() => {
    const saved = sessionStorage.getItem('authUser');
    const me = saved ? JSON.parse(saved) : null;
    const userId = Number(me?.user_id ?? 52);

    const fetchMyAccount = async () => {
      try {
        const r = await fetch(`http://localhost:5000/api/accounts/${userId}`);
        const j = await r.json().catch(() => null);
        if (r.ok && j && typeof j.id !== 'undefined') return Number(j.id);
      } catch {}
      try {
        const r2 = await fetch('http://localhost:5000/api/accounts_all/');
        const arr = await r2.json().catch(() => []);
        const meAcc = Array.isArray(arr) ? arr.find(a => Number(a.user_id) === userId) : null;
        if (meAcc) return Number(meAcc.id);
      } catch {}
      return null;
    };

    const fetchTx = async () => {
      const r = await fetch(`http://localhost:5000/api/transactions/?user_id=${userId}`);
      const j = await r.json().catch(() => null);
      if (!r.ok || !j?.ok) throw new Error(j?.message || `Failed: ${r.status}`);
      return j.items || [];
    };

    (async () => {
      try {
        const [accId, items] = await Promise.all([fetchMyAccount(), fetchTx()]);
        setMyAccountId(accId);
        setTransactions(items);
        setLoading(false);
      } catch (e) {
        console.error('取引一覧の取得に失敗:', e);
        setError('取引一覧の取得に失敗しました');
        setLoading(false);
      }
    })();
  }, []);

  const counterpartyIds = useMemo(() => {
    if (!myAccountId) return new Set();
    const set = new Set();
    for (const tx of transactions) {
      if (tx.transaction_type !== 'transfer') continue;
      const isSender = tx.sender_account_id === myAccountId;
      const isReceiver = tx.receiver_account_id === myAccountId;
      if (isSender) set.add(tx.receiver_account_id);
      else if (isReceiver) set.add(tx.sender_account_id);
    }
    return set;
  }, [transactions, myAccountId]);

  useEffect(() => {
    const unresolved = [...counterpartyIds].filter((id) => !people[id]);
    if (unresolved.length === 0) return;

    (async () => {
      try {
        let accIdx = accIndex;
        let usrIdx = userIndex;

        if (!accIdx) {
          const r = await fetch('http://localhost:5000/api/accounts_all/');
          const arr = await r.json().catch(() => []);
          accIdx = {};
          for (const a of arr) accIdx[a.id] = a.user_id;
          setAccIndex(accIdx);
        }
        if (!usrIdx) {
          const r = await fetch('http://localhost:5000/api/users/');
          const arr = await r.json().catch(() => []);
          usrIdx = {};
          for (const u of arr) usrIdx[u.user_id] = {
            name: u.name,
            avatar_path: u.avatar_path || '/images/human2.png'
          };
          setUserIndex(usrIdx);
        }

        const next = {};
        for (const accId of unresolved) {
          const uid = accIdx[accId];
          const info = uid ? usrIdx[uid] : null;
          next[accId] = info || { name: `口座ID: ${accId}`, avatar_path: '/images/human2.png' };
        }
        setPeople((prev) => ({ ...prev, ...next }));
      } catch (e) {
        console.error('相手情報の解決に失敗:', e);
      }
    })();
  }, [counterpartyIds, people, accIndex, userIndex]);

  const formatDate = (s) => {
    const d = new Date(s);
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    }).format(d);
  };

  const statusBadge = (tx) => {
    if (tx.transaction_type === 'deposit')
      return { label: '入金', bgColor: 'bg-green-100', textColor: 'text-green-800' };
    if (tx.transaction_type === 'withdrawal')
      return { label: '出金', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' };

    const done = tx.status === 'completed';
    const iAmSender   = myAccountId && tx.sender_account_id   === myAccountId;
    const iAmReceiver = myAccountId && tx.receiver_account_id === myAccountId;

    if (iAmSender)
      return { label: done ? '送金済み' : '送金中', bgColor: done ? 'bg-blue-100' : 'bg-gray-100', textColor: done ? 'text-blue-800' : 'text-gray-800' };
    if (iAmReceiver)
      return { label: done ? '受取済み' : '受取待ち', bgColor: done ? 'bg-teal-100' : 'bg-gray-100', textColor: done ? 'text-teal-800' : 'text-gray-800' };
    return { label: done ? '取引完了' : '処理中', bgColor: 'bg-gray-100', textColor: 'text-gray-800' };
  };

  const counterpartyOf = (tx) => {
    if (tx.transaction_type !== 'transfer' || !myAccountId) return null;
    const iAmSender   = tx.sender_account_id   === myAccountId;
    const iAmReceiver = tx.receiver_account_id === myAccountId;
    const accId = iAmSender ? tx.receiver_account_id
                : iAmReceiver ? tx.sender_account_id
                : (tx.receiver_account_id || tx.sender_account_id);
    const info = people[accId] || { name: `口座ID: ${accId}`, avatar_path: '/images/human2.png' };
    const prefix = iAmReceiver ? '送金者：' : iAmSender ? '受取者：' : '相手：';
    return { id: accId, name: `${prefix}${info.name}`, icon: info.avatar_path || '/images/human2.png' };
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-white">
      {/* Top.jsx と同じ幅管理のヘッダー */}
      <Header title="取引履歴" backTo="/" />

      {/* Top.jsx と同じ本文レイアウト */}
      <div className="flex justify-center h-[calc(100vh-56px)] overflow-hidden">
        <div className="min-w-[300px] w-full max-w-sm p-6 flex flex-col bg-gray-50">
          <div className="space-y-4 overflow-hidden">
            {/* カード */}
            <section className="bg-white rounded-xl shadow-sm p-4 overflow-hidden">
              {loading ? (
                <div className="p-8 text-center text-gray-500">読み込み中…</div>
              ) : error ? (
                <div className="p-8 text-center text-red-600">{error}</div>
              ) : transactions.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {transactions.map((tx) => {
                    const badge = statusBadge(tx);
                    const cp = counterpartyOf(tx);

                    return (
                      <li key={tx.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <BillingInfo
                            billing={{
                              id: tx.id,
                              amount: tx.amount,
                              message: tx.message || '',
                              createdAt: tx.created_at,
                            }}
                            formatDate={formatDate}
                            statusStyle={badge}
                          />
                          {tx.transaction_type === 'transfer' && cp && (
                            <PayerInfo
                              payer={cp}
                              className="ml-4"
                              size="sm"
                              align="left"
                              labelText="相手"
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
            </section>

            {/* 戻るボタン */}
            <div className="mt-2">
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

export default TransactionsList;
