// src/pages/Help.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Button1 from '../components/button1';

const faqs = [
  {
    q: 'アカウント情報はどこで確認できますか？',
    a: 'ホーム（トップ）画面の上部にある「ユーザー情報カード」に、氏名・アカウント番号（下4桁のみ）・アイコンが表示されます。'
  },
  {
    q: '送金する手順を教えてください。',
    a: 'トップ > 「送金する」ボタン > 送金先・金額・メモを入力 > 確認 > 送金完了 の順に進みます。送金完了画面から取引履歴へ移動できます。'
  },
  {
    q: '請求リンクの作り方は？',
    a: 'トップ > 「請求する」ボタン > 金額・メッセージを入力 > リンク作成。作成後はコピーや各SNS共有ボタンで送付できます。'
  },
  {
    q: '取引履歴を見たい',
    a: 'トップ > 「取引履歴」から直近の入出金が確認できます。各明細をタップすると詳細が開きます。'
  },
  {
    q: 'ログイン中のユーザーを変更/ログアウトしたい',
    a: 'トップ画面の最下部にある「ログアウト」ボタンからログアウトできます。ログアウト後に再度ログインしてください。'
  },
  {
    q: 'エラー（通信エラー/404/500）が出た',
    a: '一度ページを再読み込みし、ネットワーク状況をご確認ください。改善しない場合は時間をおいて再試行し、継続する場合はサポートへご連絡ください。'
  },
];

export default function Help() {
  const navigate = useNavigate();
  const goto = (path) => () => navigate(path);

  return (
    <div className="fixed inset-0 overflow-hidden bg-white">
      {/* ヘッダー */}
      <Header title="ヘルプ" backTo="/" />

      <div className="flex justify-center h-[calc(100vh-56px)] overflow-hidden">
        <div className="min-w-[300px] w-full max-w-sm p-6 flex flex-col bg-gray-50">
          <div className="space-y-4 overflow-auto">
            {/* FAQ */}
            <section className="bg-white rounded-2xl shadow-sm p-6">
              <h1 className="text-xl sm:text-2xl font-semibold mb-2 text-red-600">よくある質問</h1>
              <p className="text-sm text-gray-600 mb-4">
                送金アプリの使い方やトラブル時の対処をまとめました。
              </p>

              <ul className="divide-y">
                {faqs.map((item, idx) => (
                  <li key={idx} className="py-4">
                    <details className="group">
                      <summary className="cursor-pointer list-none flex items-start justify-between">
                        <span className="font-medium text-gray-900 pr-3">{item.q}</span>
                        <span className="shrink-0 ml-3 text-gray-400 group-open:rotate-180 transition-transform">
                          ▼
                        </span>
                      </summary>
                      <p className="mt-2 text-sm text-gray-700 leading-relaxed">{item.a}</p>
                    </details>
                  </li>
                ))}
              </ul>
            </section>

            {/* クイックアクセス */}
            <section className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-3 text-red-600">クイックアクセス</h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={goto('/step3')}
                  className="py-3 px-4 rounded-xl bg-red-100 text-red-600 font-medium hover:opacity-90 transition"
                >
                  送金する
                </button>
                <button
                  onClick={goto('/request')}
                  className="py-3 px-4 rounded-xl bg-gray-200 text-gray-700 font-medium hover:opacity-90 transition"
                >
                  請求する
                </button>
                <button
                  onClick={goto('/billing-status')}
                  className="py-3 px-4 rounded-xl bg-gray-200 text-gray-700 font-medium hover:opacity-90 transition"
                >
                  請求ステータス
                </button>
                <button
                  onClick={goto('/TransactionsList')}
                  className="py-3 px-4 rounded-xl bg-gray-200 text-gray-700 font-medium hover:opacity-90 transition"
                >
                  取引履歴
                </button>
                {/* SupportAI への遷移追加 */}
                <button
                  onClick={goto('/support-ai')}
                  className="col-span-2 py-3 px-4 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition"
                >
                  AIサポートに質問する
                </button>
              </div>
            </section>

            {/* トラブルシューティング */}
            <section className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-3 text-red-600">トラブルシューティング</h2>
              <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
                <li>ページを再読み込み（Ctrl/⌘ + R）。</li>
                <li>ネットワーク接続を確認（Wi-Fi/モバイルデータ）。</li>
                <li>時間をおいて再試行（サーバが混雑している可能性）。</li>
                <li>ブラウザのプライベートウィンドウで再ログイン。</li>
                <li>改善しない場合はサポート窓口へ連絡。</li>
              </ol>
            </section>

            {/* サポート */}
            <section className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-3 text-red-600">サポート</h2>
              <div className="text-sm text-gray-700 space-y-2">
                <p>
                  メール:&nbsp;
                  <a
                    href="mailto:support@example.com?subject=%E9%80%81%E9%87%91%E3%82%A2%E3%83%97%E3%83%AA%E3%81%AE%E5%95%8F%E3%81%84%E5%90%88%E3%82%8F%E3%81%9B"
                    className="underline underline-offset-2 text-red-600"
                  >
                    support@example.com
                  </a>
                </p>
                <p>対応時間: 平日 10:00–18:00（JST）</p>
              </div>
            </section>

            {/* バージョン情報 */}
            <section className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-2 text-red-600">アプリ情報</h2>
              <div className="text-sm text-gray-600 space-y-1">
                <p>バージョン: 1.0.0 / 最終更新: 2025-09-04</p>
                <p>開発者: <span className="font-medium">SukiyakiBento</span></p>
                <p className="text-xs text-gray-500 pt-1">
                  Copyright © 2025 SukiyakiBento. All rights reserved.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
