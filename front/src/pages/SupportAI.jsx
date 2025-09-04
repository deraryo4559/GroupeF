// src/pages/SupportAI.jsx
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { AiIcon } from "../components/MenuIcons";

export default function SupportAI() {
  // .env で上書きできるように（未設定なら指定の埋め込みURLを使用）
  const EMBED_URL =
    import.meta.env.VITE_DIFY_WEBAPP_URL ||
    "https://udify.app/chatbot/NrSOWeQJ3m7oE1yv";

  const [isLoading, setIsLoading] = useState(true);

  // iframeのロード状態を管理
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // 5秒後にローディング表示を終了（万が一読み込みが遅い場合のフォールバック）
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // チャットの質問サジェスト（オプショナル）
  const chatSuggestions = [
    "送金限度額について教えて",
    "請求リンクの使い方は？",
    "取引履歴の確認方法",
    "パスワードを忘れました"
  ];

  return (
    <div className="fixed inset-0 overflow-hidden bg-white">
      {/* ヘッダー - Top.jsxと同様のスタイル */}
      <Header title="AIサポート" backTo="/" />

      {/* メインコンテンツエリア - チャットを中心に */}
      <div className="flex justify-center h-[calc(100vh-56px)] overflow-hidden">
        <div className="min-w-[300px] w-full max-w-sm flex flex-col bg-gray-50">
          {/* AIチャットカード - 画面いっぱいに表示 */}
          <section className="bg-white flex-1 flex flex-col h-full">
            {/* AIチャットコンテンツエリア - 高さを最大化 */}
            <div className="flex-1 flex flex-col h-full">
              {/* iframeローディングオーバーレイ */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-10">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 border-3 border-gray-200 border-t-red-500 rounded-full animate-spin"></div>
                    <p className="mt-3 text-xs text-gray-600">AIサポートを準備中...</p>
                  </div>
                </div>
              )}

              {/* iframe本体 - 最大高さで表示 */}
              <iframe
                title="Support AI"
                src={EMBED_URL}
                className="w-full flex-1 h-full"
                allow="microphone; clipboard-write; display-capture"
                frameBorder="0"
                onLoad={() => setIsLoading(false)}
              />

              {/* チャット質問サジェスト - iframeの下部にコンパクトに配置 */}
              <div className="p-2 bg-gray-50 border-t border-gray-100">
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {chatSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="px-3 py-1.5 text-xs whitespace-nowrap bg-white text-gray-600 rounded-full shadow-sm border border-gray-200 hover:bg-gray-50"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
