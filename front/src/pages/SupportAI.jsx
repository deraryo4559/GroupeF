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
          {/* カード内を縦いっぱい使って iframe を表示 */}
          <section className="bg-white rounded-2xl shadow-sm flex-1 min-h-[640px] overflow-hidden">
            <iframe
              title="Support AI"
              src={EMBED_URL}
              className="w-full h-full"
              // 必要に応じてマイク/クリップボード等の権限を許可
              allow="microphone; clipboard-write; display-capture"
              frameBorder="0"
            />
          </section>

          {/* 補助アクション（任意） */}
          <div className="mt-3 text-center">
            <a
              href={EMBED_URL}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-gray-600 underline underline-offset-2 hover:opacity-80"
            >
              新しいタブで開く
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
