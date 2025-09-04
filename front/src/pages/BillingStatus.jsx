// src/pages/BillingStatus.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button1 from '../components/button1';
import Header from '../components/Header';

const BillingStatus = () => {
  const navigate = useNavigate();

  const [billingHistory, setBillingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  // ボトムシート制御
  const [openId, setOpenId] = useState(null);        // 開こうとしている項目ID（= モーダル存在判定）
  const [sheetShown, setSheetShown] = useState(false); // スライドアニメ用（trueで表示状態）
  const selected = useMemo(
    () => billingHistory.find(b => b.id === openId) || null,
    [openId, billingHistory]
  );

  useEffect(() => {
    const saved = sessionStorage.getItem('authUser');
    const me = saved ? JSON.parse(saved) : null;
    const requester_user_id = me?.user_id ?? 52;

    fetch(`http://localhost:5000/api/requests/?requester_user_id=${requester_user_id}`)
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!res.ok || !data?.ok) throw new Error(data?.message || `Failed: ${res.status}`);
        const mapped = (data.items || []).map((r) => ({
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
          paidBy: r.paid_by || null,
          link: r.link,
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
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    }).format(date);
  };

  const statusBadge = (status) => {
    if (status === 'paid')
      return { label: '支払い済み', bg: 'bg-emerald-100', text: 'text-emerald-800', ring: 'ring-emerald-200' };
    if (status === 'canceled')
      return { label: 'キャンセル済み', bg: 'bg-gray-100', text: 'text-gray-700', ring: 'ring-gray-200' };
    return { label: '未払い', bg: 'bg-amber-100', text: 'text-amber-800', ring: 'ring-amber-200' };
  };

  const cancelRequest = async (billingId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/requests/${billingId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        alert("取り下げに失敗しました");
        return;
      }
      setBillingHistory((prev) =>
        prev.map((b) => (b.id === billingId ? { ...b, status: "canceled" } : b))
      );
    } catch (err) {
      console.error("通信エラー:", err);
      alert("通信エラーが発生しました");
    }
  };

  // ===== ボトムシートの開閉（スライドアニメ含む） =====
  const openSheet = (id) => {
    setOpenId(id);                 // まずモーダルをマウント
    // 次のフレームで表示フラグをONにしてスライドさせる
    requestAnimationFrame(() => setSheetShown(true));
  };
  const closeSheet = () => {
    // 先に非表示アニメを開始
    setSheetShown(false);
    // CSSのdurationと合わせてアンマウント
    setTimeout(() => setOpenId(null), 250); // 250ms = duration-200 + α
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-white">
      <Header title="請求履歴" backTo="/" />

      <div className="flex justify-center h-[calc(100vh-56px)] overflow-hidden">
        <div className="min-w-[300px] w-full max-w-sm p-6 flex flex-col bg-gray-50">
          <div className="space-y-4 overflow-hidden">
            {/* リストカード */}
            <section className="bg-white rounded-2xl shadow-sm p-0 overflow-hidden border border-red-200">
              {/* ブランドバー */}
              <div className="h-10 bg-gradient-to-r from-red-600 to-red-500 text-white flex items-center justify-between px-4">
                <h2 className="text-sm font-semibold tracking-wide">請求履歴</h2>
                <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded">最新順</span>
              </div>

              {/* 本文 */}
              <div className="p-2">
                {loading ? (
                  <div className="p-6 space-y-3">
                    <div className="h-16 rounded-xl bg-red-50 animate-pulse" />
                    <div className="h-16 rounded-xl bg-red-50 animate-pulse" />
                  </div>
                ) : error ? (
                  <div className="p-8 text-center text-red-700">{error}</div>
                ) : billingHistory.length > 0 ? (
                  <ul className="divide-y divide-red-100">
                    {billingHistory.map((b) => {
                      const badge = statusBadge(b.status);
                      return (
                        <li key={b.id}>
                          <button
                            onClick={() => openSheet(b.id)}
                            className="w-full text-left p-4 flex items-start justify-between gap-3 hover:bg-red-50/40 transition"
                          >
                            <div>
                              <div className="text-xl font-semibold text-gray-900">
                                {Number(b.amount).toLocaleString()}<span className="text-base ml-0.5">円</span>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">{formatDate(b.createdAt)}</div>
                            </div>
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
                  <div className="p-8 text-center text-gray-500">請求履歴がありません</div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* ====== ボトムシート（下スライド） ====== */}
      {selected && (
        <div className="fixed inset-0 z-40">
          {/* 背景フェード（クリックで閉じる） */}
          <div
            className={`absolute inset-0 bg-black/30 transition-opacity duration-200 ${sheetShown ? 'opacity-100' : 'opacity-0'}`}
            onClick={closeSheet}
          />

          {/* シート：translate-y でスライド */}
          <div
            className={`absolute inset-x-0 bottom-0 mx-auto w-full max-w-sm
                        transform transition-transform duration-200 ease-out
                        ${sheetShown ? 'translate-y-0' : 'translate-y-full'}`}
          >
            <div
              className="rounded-t-2xl bg-white shadow-xl ring-1 ring-red-200 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* ヘッダー */}
              <div className="h-11 bg-gradient-to-r from-red-600 to-red-500 text-white flex items-center justify-between px-4">
                <div className="text-sm font-semibold">請求の詳細</div>
                <button className="text-white/90 hover:text-white" onClick={closeSheet}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* 本文 */}
              <div className="p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-2xl font-semibold text-gray-900">
                      {Number(selected.amount).toLocaleString()}<span className="text-lg ml-0.5">円</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{formatDate(selected.createdAt)}</div>
                  </div>
                  {(() => {
                    const badge = statusBadge(selected.status);
                    return (
                      <span className={`text-[12px] px-2 py-0.5 rounded-full ${badge.bg} ${badge.text} ring-1 ${badge.ring}`}>
                        {badge.label}
                      </span>
                    );
                  })()}
                </div>

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

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-lg bg-white border border-red-100 p-3">
                    <div className="text-[11px] text-gray-500">請求ID</div>
                    <div className="font-mono text-gray-800">{selected.id}</div>
                  </div>
                  <div className="rounded-lg bg-white border border-red-100 p-3">
                    <div className="text-[11px] text-gray-500">ステータス</div>
                    <div className="text-gray-800">{statusBadge(selected.status).label}</div>
                  </div>
                </div>

                {selected.paidBy && (
                  <div className="rounded-xl bg-white border border-emerald-100 p-3">
                    <div className="text-[11px] text-emerald-700 mb-1">支払者</div>
                    <div className="flex items-center gap-2">
                      <img
                        src={selected.paidBy.icon || '/images/human2.png'}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="text-sm text-gray-800">{selected.paidBy.name}</div>
                    </div>
                  </div>
                )}

                {selected.link && (
                  <div className="rounded-xl bg-white border border-red-100 p-3">
                    <div className="text-[11px] text-red-700 mb-1">請求リンク</div>
                    <div className="text-xs break-all">{selected.link}</div>
                    <div className="mt-2">
                      <button
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(selected.link);
                            alert('リンクをコピーしました');
                          } catch {
                            alert('コピーに失敗しました');
                          }
                        }}
                        className="text-sm px-3 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600"
                      >
                        リンクをコピー
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {selected.status === 'pending' ? (
                    <button
                      onClick={() => cancelRequest(selected.id)}
                      className="flex-1 py-2 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition"
                    >
                      請求を取り下げる
                    </button>
                  ) : (
                    <button
                      disabled
                      className="flex-1 py-2 rounded-xl bg-gray-100 text-gray-400 font-medium"
                    >
                      取り下げ不可
                    </button>
                  )}
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
      {/* ====== /ボトムシート ====== */}
    </div>
  );
};

export default BillingStatus;
