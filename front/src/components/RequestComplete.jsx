// src/components/RequestComplete.jsx
import { useLocation, useNavigate } from "react-router-dom";

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
    <div className="w-full max-w-xs md:max-w-md lg:max-w-lg mx-auto p-6 bg-white rounded-xl shadow text-gray-800">
      <div className="text-sm text-gray-600">請求リンクが作成されました</div>
      <div className="text-xs text-gray-500 mt-2">(請求リンクをここに表示する)</div>

      {/* リンク表示（折り返し） */}
      <div className="mt-3 p-3 bg-gray-50 border rounded-md text-xs break-all">
        {link}
      </div>

      <button
        type="button"
        onClick={copyToClipboard}
        className="mt-6 w-full py-3.5 rounded-xl text-white text-[15px] md:text-base font-medium shadow-inner bg-green-600 hover:bg-green-700 transition-colors"
      >
        リンクをコピー
      </button>

      <button
        type="button"
        onClick={() => navigate("/")}
        className="mt-3 w-full py-3.5 rounded-xl text-[15px] md:text-base font-medium bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 transition-colors"
      >
        トップ画面に戻る
      </button>
    </div>
  );
}

export default RequestComplete;
