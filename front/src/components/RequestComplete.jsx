// src/components/RequestComplete.jsx
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";


function RequestComplete() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const link =
    state?.link ?? `${window.location.origin}/pay/example`; // フォールバック

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(link);
      alert("リンクをコピーしました");
    } catch {
      alert("コピーに失敗しました");
    }
  };

  return (
    <>
      <Header title="請求完了" backTo="/" />
      <div className="min-h-screen pt-20 px-4 pb-8 bg-gray-50">
        <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-sm p-6">
          {/* 完了アイコン */}
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>

          <h1 className="text-xl font-bold text-center mb-6">請求リンクが作成されました</h1>

          {/* リンク表示（折り返し） */}
          <div className="p-4 bg-gray-50 border rounded-lg text-sm break-all">
            {link}
          </div>

          <button
            type="button"
            onClick={copyToClipboard}
            className="mt-6 w-full py-3.5 rounded-xl text-white text-base font-medium shadow-sm bg-green-600 hover:bg-green-700 transition-colors"
          >
            リンクをコピー
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-4 w-full py-3.5 rounded-xl text-base font-medium bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 transition-colors"
          >
            トップ画面に戻る
          </button>
        </div>
      </div>
    </>
  );
}

export default RequestComplete;
