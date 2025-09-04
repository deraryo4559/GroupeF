// src/pages/SupportAI.jsx
import React from "react";
import Header from "../components/Header";

export default function SupportAI() {
  // .env で上書きできるように（未設定なら指定の埋め込みURLを使用）
  const EMBED_URL =
    import.meta.env.VITE_DIFY_WEBAPP_URL ||
    "https://udify.app/chatbot/NrSOWeQJ3m7oE1yv";

  return (
    <div className="fixed inset-0 overflow-hidden bg-white">
      {/* Top.jsx と同じヘッダー（高さ56px想定） */}
      <Header title="AIサポート" backTo="/" />

      {/* Top.jsx と同スケールのレイアウト＆幅 */}
      <div className="flex justify-center h-[calc(100vh-56px)] overflow-hidden">
        <div className="min-w-[300px] w-full max-w-sm p-6 flex flex-col bg-gray-50">
          {/* MUFG 赤 × 白のカードレイアウト */}
          <section className="bg-white rounded-2xl shadow-sm border border-red-200 overflow-hidden flex-1 min-h-[640px]">
            {/* カード上部：レッドバー（ブランド感） */}
            <div className="h-11 bg-gradient-to-r from-red-600 to-red-500 text-white flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                {/* シンプルなロゴ風アイコン（赤円＋白円） */}
                <span className="relative inline-flex w-5 h-5">
                  <span className="absolute inset-0 rounded-full bg-white/20" />
                  <span className="absolute inset-1 rounded-full bg-white" />
                </span>
                <h2 className="text-sm font-semibold tracking-wide">サポートAI</h2>
              </div>
              {/* 右側ステータスチップ */}
              <span className="text-[11px] font-medium bg-white/20 px-2 py-0.5 rounded">
                オンライン
              </span>
            </div>

            {/* ボディ：iframe 枠を赤みのある下地で包む（※iframe内は外部のためテーマ適用不可） */}
            <div className="p-3 bg-red-50">
              <div className="rounded-xl overflow-hidden ring-1 ring-red-200 bg-white">
                <iframe
                  title="Support AI"
                  src={EMBED_URL}
                  className="w-full h-[calc(640px-44px-24px)] min-h-[560px] block"
                  // 必要に応じてマイク/クリップボード等の権限を許可
                  allow="microphone; clipboard-write; display-capture"
                  frameBorder="0"
                />
              </div>

              {/* ヒント行（ユーザー誘導） */}
              <div className="mt-3 text-xs text-red-700/90 bg-red-100 rounded-lg p-3 leading-relaxed">
                よくある質問のキーワード例：
                <span className="inline-flex gap-1.5 flex-wrap ml-1">
                  <span className="px-2 py-0.5 rounded-full bg-white text-red-700 ring-1 ring-red-200">送金限度額</span>
                  <span className="px-2 py-0.5 rounded-full bg-white text-red-700 ring-1 ring-red-200">請求リンク</span>
                  <span className="px-2 py-0.5 rounded-full bg-white text-red-700 ring-1 ring-red-200">取引履歴</span>
                  <span className="px-2 py-0.5 rounded-full bg-white text-red-700 ring-1 ring-red-200">ログインできない</span>
                </span>
              </div>
            </div>
          </section>

          {/* 補助アクション */}
          <div className="mt-3 flex items-center gap-3">
            <a
              href={EMBED_URL}
              target="_blank"
              rel="noreferrer"
              className="flex-1 text-center text-sm font-medium rounded-lg bg-red-500 text-white py-2 hover:bg-red-600 transition"
            >
              新しいタブで開く
            </a>
            <a
              onClick={(e) => {
                e.preventDefault();
                // クリアに戻る動線：Top へ
                history.length > 1 ? window.history.back() : (window.location.href = "/");
              }}
              href="/"
              className="text-sm text-red-700 underline underline-offset-2 hover:opacity-80"
            >
              戻る
            </a>
          </div>

          {/* 注意：iframe 内は外部サービスのためテーマ反映不可（外枠のみ調整可能） */}
        </div>
      </div>
    </div>
  );
}
