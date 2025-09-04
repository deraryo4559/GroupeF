// src/pages/TransactionsList.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button1 from '../components/button1';
import Header from '../components/Header';

const TransactionsList = () => {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [myAccountId, setMyAccountId]   = useState(null);
  const [loading, setLoading]           = useState(true);
  const [error,   setError]             = useState(null);

  // 口座ID -> { name, avatar_path } の簡易キャッシュ（索引は文字列キーで統一）
  const [people, setPeople]       = useState({});
  const [accIndex, setAccIndex]   = useState(null); // { [account_id:str]: user_id:str }
  const [userIndex, setUserIndex] = useState(null); // { [user_id:str]: { name, avatar_path } }

  // ======= 詳細ボトムシート（下スライド）制御 =======
  const [openId, setOpenId] = useState(null);
  const [sheetShown, setSheetShown] = useState(false);
  const selected = useMemo(
    () => transactions.find(t => t.id === openId) || null,
    [openId, transactions]
  );
  const openSheet = (id) => {
    setOpenId(id);
    requestAnimationFrame(() => setSheetShown(true));
  };
  const closeSheet = () => {
    setSheetShown(false);
    setTimeout(() => setOpenId(null), 250);
  };
  // ================================================

  useEffect(() => {
    const saved = sessionStorage.getItem('authUser');
    const me = saved ? JSON.parse(saved) : null;
    const userId = Number(me?.user_id ?? 52);

    const fetchMyAccount = async () => {
      try {
        const r = await fetch(`http://localhost:5000/api/accounts/${userId}`);
        const j = await r.json().catch(() => null);
        if (r.ok && j && (j.id ?? j.account_id)) return Number(j.id ?? j.account_id);
      } catch {}
      try {
        const r2 = await fetch('http://localhost:5000/api/accounts_all/');
        const arr = await r2.json().catch(() => []);
        const meAcc = Array.isArray(arr)
          ? arr.find(a => Number(a.user_id ?? a.owner_user_id ?? a.userId) === userId)
          : null;
        if (meAcc) return Number(meAcc.id ?? meAcc.account_id);
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
        setMyAccountId(accId !== null ? Number(accId) : null);
        setTransactions(items);
        setLoading(false);
      } catch (e) {
        console.error('取引一覧の取得に失敗:', e);
        setError('取引一覧の取得に失敗しました');
        setLoading(false);
      }
    })();
  }, []);

  // 自分以外の相手口座ID集合（NumberでOK）
  const counterpartyIds = useMemo(() => {
    if (!myAccountId) return new Set();
    const set = new Set();
    for (const tx of transactions) {
      if (tx.transaction_type !== 'transfer') continue;
      const isSender   = Number(tx.sender_account_id)   === Number(myAccountId);
      const isReceiver = Number(tx.receiver_account_id) === Number(myAccountId);
      if (isSender)   set.add(Number(tx.receiver_account_id));
      if (isReceiver) set.add(Number(tx.sender_account_id));
    }
    return set;
  }, [transactions, myAccountId]);

  // 相手口座ID -> ユーザー名 を解決
  useEffect(() => {
    const unresolved = [...counterpartyIds].filter((id) => !people[id]);
    if (unresolved.length === 0) return;

    (async () => {
      try {
        let aIdx = accIndex; // 口座ID(String) -> ユーザーID(String)
        let uIdx = userIndex; // ユーザーID(String) -> 情報

        if (!aIdx) {
          const r = await fetch('http://localhost:5000/api/accounts_all/');
          const arr = await r.json().catch(() => []);
          aIdx = {};
          for (const a of (Array.isArray(arr) ? arr : [])) {
            const aid = String(a.id ?? a.account_id ?? a.accountId ?? a.accountID);
            const uid = String(a.user_id ?? a.owner_user_id ?? a.userId ?? a.userID);
            if (aid && uid && aid !== 'undefined' && uid !== 'undefined') {
              aIdx[aid] = uid;
            }
          }
          setAccIndex(aIdx);
        }

        if (!uIdx) {
          const r = await fetch('http://localhost:5000/api/users/');
          const arr = await r.json().catch(() => []);
          uIdx = {};
          for (const u of (Array.isArray(arr) ? arr : [])) {
            const uid = String(u.user_id ?? u.id ?? u.userID);
            if (!uid || uid === 'undefined') continue;
            uIdx[uid] = {
              name: u.name ?? u.display_name ?? `ユーザー${uid}`,
              avatar_path: u.avatar_path || '/images/human2.png',
            };
          }
          setUserIndex(uIdx);
        }

        const next = {};
        for (const raw of unresolved) {
          const accIdStr = String(raw);
          const uidStr   = aIdx?.[accIdStr];
          let info = uidStr ? uIdx?.[uidStr] : null;
          if (!info) info = uIdx?.[accIdStr] || null; // フォールバック
          if (!info) {
            const n = Number(raw);
            const uid2 = aIdx?.[String(n)];
            info = (uid2 && uIdx?.[String(uid2)]) || uIdx?.[String(n)] || null;
          }
          next[Number(raw)] = info || { name: '不明なユーザー', avatar_path: '/images/human2.png' };
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

  // ステータスバッジ（MUFGトーン）
  const statusBadge = (tx) => {
    if (tx.transaction_type === 'deposit')
      return { label: '入金', bg: 'bg-emerald-100', text: 'text-emerald-800', ring: 'ring-emerald-200' };
    if (tx.transaction_type === 'withdrawal')
      return { label: '出金', bg: 'bg-amber-100', text: 'text-amber-800', ring: 'ring-amber-200' };

    const done = tx.status === 'completed';
    const iAmSender   = Number(myAccountId) && Number(tx.sender_account_id)   === Number(myAccountId);
    const iAmReceiver = Number(myAccountId) && Number(tx.receiver_account_id) === Number(myAccountId);

    if (iAmSender)
      return { label: done ? '送金済み' : '送金中', bg: done ? 'bg-blue-100' : 'bg-gray-100', text: done ? 'text-blue-800' : 'text-gray-700', ring: done ? 'ring-blue-200' : 'ring-gray-200' };
    if (iAmReceiver)
      return { label: done ? '受取済み' : '受取待ち', bg: done ? 'bg-teal-100' : 'bg-gray-100', text: done ? 'text-teal-800' : 'text-gray-700', ring: done ? 'ring-teal-200' : 'ring-gray-200' };
    return { label: done ? '取引完了' : '処理中', bg: 'bg-gray-100', text: 'text-gray-700', ring: 'ring-gray-200' };
  };

  const counterpartyOf = (tx) => {
    if (tx.transaction_type !== 'transfer' || !myAccountId) return null;
    const senderId   = Number(tx.sender_account_id);
    const receiverId = Number(tx.receiver_account_id);
    const mine       = Number(myAccountId);
    const iAmSender   = senderId === mine;
    const iAmReceiver = receiverId === mine;
    const accId = Number(iAmSender ? receiverId : iAmReceiver ? senderId : (receiverId || senderId));
    const info = people[accId] || { name: '不明なユーザー', avatar_path: '/images/human2.png' };
    const prefix = iAmReceiver ? '送金者：' : iAmSender ? '受取者：' : '相手：';
    return { id: accId, name: `${prefix}${info.name}`, icon: info.avatar_path || '/images/human2.png' };
  };

  // シート内でも相手情報が必要
  const selectedCounterparty = selected ? counterpartyOf(selected) : null;

  return (
    <div className="fixed inset-0 overflow-hidden bg-white">
      {/* ヘッダー */}
      <Header title="取引履歴" backTo="/" />

      {/* 本文（Top.jsxと同スケール） */}
      <div className="flex justify-center h-[calc(100vh-56px)] overflow-hidden">
        <div className="min-w-[300px] w-full max-w-sm p-6 flex flex-col bg-gray-50">
          <div className="space-y-4 overflow-hidden">
            {/* MUFGカード */}
            <section className="bg-white rounded-2xl shadow-sm overflow-hidden border border-red-200">
              {/* ブランドバー */}
              <div className="h-10 bg-gradient-to-r from-red-600 to-red-500 text-white flex items-center justify-between px-4">
                <h2 className="text-sm font-semibold tracking-wide">取引一覧</h2>
                <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded">最新順</span>
              </div>

              {/* リスト */}
              <div className="p-2">
                {loading ? (
                  <div className="p-6 space-y-3">
                    <div className="h-16 rounded-xl bg-red-50 animate-pulse" />
                    <div className="h-16 rounded-xl bg-red-50 animate-pulse" />
                  </div>
                ) : error ? (
                  <div className="p-8 text-center text-red-700">{error}</div>
                ) : transactions.length > 0 ? (
                  <ul className="divide-y divide-red-100">
                    {transactions.map((tx) => {
                      const badge = statusBadge(tx);
                      const cp = counterpartyOf(tx);
                      return (
                        <li key={tx.id}>
                          <button
                            onClick={() => openSheet(tx.id)}
                            className="w-full text-left p-4 flex items-start justify-between gap-3 hover:bg-red-50/40 transition"
                          >
                            {/* 左側：金額/日付/メモ/相手 */}
                            <div>
                              <div className="text-xl font-semibold text-gray-900">
                                {Number(tx.amount).toLocaleString()}<span className="text-base ml-0.5">円</span>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">{formatDate(tx.created_at)}</div>
                              {cp && (
                                <div className="text-[12px] text-gray-700 mt-1">{cp.name}</div>
                              )}
                              {/* {tx.message && (
                                <div className="text-[13px] text-gray-700 mt-1 line-clamp-2">{tx.message}</div>
                              )} */}
                            </div>

                            {/* 右側：ステータス＋矢印 */}
                            <div className="flex flex-col items-end gap-2">
                              <span className={`text-[11px] px-2 py-0.5 rounded-full ${badge.bg} ${badge.text} ring-1 ${badge.ring}`}>
                                {badge.label}
                              </span>
                              <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="none"
                                   stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 18l6-6-6-6" />
                              </svg>
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="p-8 text-center text-gray-500">取引履歴がありません</div>
                )}
              </div>
            </section>

            {/* 戻る */}
            <div className="mt-2">
              <Button1 onClick={() => navigate('/')} variant="primary" className="w-full bg-red-500 text-white hover:bg-red-600">
                ホームに戻る
              </Button1>
            </div>
          </div>
        </div>
      </div>

      {/* ====== 下からスライドする詳細モーダル ====== */}
      {selected && (
        <div className="fixed inset-0 z-40">
          {/* 背景フェード */}
          <div
            className={`absolute inset-0 bg-black/30 transition-opacity duration-200 ${sheetShown ? 'opacity-100' : 'opacity-0'}`}
            onClick={closeSheet}
          />
          {/* シート */}
          <div
            className={`absolute inset-x-0 bottom-0 mx-auto w-full max-w-sm transform transition-transform duration-200 ease-out
                        ${sheetShown ? 'translate-y-0' : 'translate-y-full'}`}
          >
            <div
              className="rounded-t-2xl bg-white shadow-xl ring-1 ring-red-200 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* ヘッダー */}
              <div className="h-11 bg-gradient-to-r from-red-600 to-red-500 text-white flex items-center justify-between px-4">
                <div className="text-sm font-semibold">取引の詳細</div>
                <button className="text-white/90 hover:text-white" onClick={closeSheet}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* 本文 */}
              <div className="p-4 space-y-4">
                {/* 金額＋ステータス */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-2xl font-semibold text-gray-900">
                      {Number(selected.amount).toLocaleString()}<span className="text-lg ml-0.5">円</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{formatDate(selected.created_at)}</div>
                  </div>
                  {(() => {
                    const badge = statusBadge(selected);
                    return (
                      <span className={`text-[12px] px-2 py-0.5 rounded-full ${badge.bg} ${badge.text} ring-1 ${badge.ring}`}>
                        {badge.label}
                      </span>
                    );
                  })()}
                </div>

                {/* 相手情報（送金取引のみ） */}
                {selectedCounterparty && (
                  <div className="rounded-xl bg-white border border-red-100 p-3">
                    <div className="text-[11px] text-red-700 mb-1">相手</div>
                    <div className="flex items-center gap-2">
                      <img
                        src={selectedCounterparty.icon}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="text-sm text-gray-800">{selectedCounterparty.name}</div>
                    </div>
                  </div>
                )}

                {/* メモ */}
                {selected.message ? (
                  <div className="bg-red-50/50 border border-red-100 rounded-xl p-3 text-sm text-gray-800">
                    <div className="text-[11px] text-red-700 mb-1">メモ</div>
                    <div className="whitespace-pre-wrap break-words">{selected.message}</div>
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm text-gray-500">
                    メモはありません
                  </div>
                )}

                {/* 参考情報 */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-lg bg-white border border-red-100 p-3">
                    <div className="text-[11px] text-gray-500">取引ID</div>
                    <div className="font-mono text-gray-800">{selected.id}</div>
                  </div>
                  <div className="rounded-lg bg-white border border-red-100 p-3">
                    <div className="text-[11px] text-gray-500">種別</div>
                    <div className="text-gray-800">
                      {selected.transaction_type === 'deposit' ? '入金'
                        : selected.transaction_type === 'withdrawal' ? '出金'
                        : '送金'}
                    </div>
                  </div>
                </div>

                {/* クローズ */}
                <div className="flex items-center justify-end">
                  <button
                    onClick={closeSheet}
                    className="px-4 py-2 rounded-xl border border-red-200 text-red-700 bg-white hover:bg-red-50"
                  >
                    閉じる
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* /シート */}
        </div>
      )}
      {/* ====== /詳細モーダル ====== */}
    </div>
  );
};

export default TransactionsList;
