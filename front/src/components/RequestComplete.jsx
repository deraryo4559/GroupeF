// src/components/RequestComplete.jsx
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";


function RequestComplete() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const link =
    state?.link ?? `${window.location.origin}/pay/example`; // フォールバック
  const amount = state?.amount ?? "0";
  const message = state?.msg ?? "";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(link);
      alert("リンクをコピーしました");
    } catch {
      alert("コピーに失敗しました");
    }
  };

  // SNS共有用のメッセージを作成
  const shareMessage = `${message ? message + "\n" : ""}支払いリンク: ${link}`;
  const shareTitle = `${amount}円の支払い請求`;

  // LINE共有
  const shareToLine = () => {
    const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(link)}&text=${encodeURIComponent(shareMessage)}`;
    window.open(lineUrl, '_blank');
  };

  // Twitter(X)共有
  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`;
    window.open(twitterUrl, '_blank');
  };

  // WhatsApp共有
  const shareToWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Web Share API（モバイルデバイスでサポートされている場合）
  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareMessage,
          url: link,
        });
      } catch (error) {
        console.log('共有がキャンセルされました', error);
      }
    } else {
      // Web Share APIがサポートされていない場合はコピー
      copyToClipboard();
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-white">
      {/* Top.jsx と同じヘッダー（高さ56px想定） */}
      <Header title="請求完了" backTo="/" />

      {/* Top.jsx と同スケールのレイアウト＆幅 */}
      <div className="flex justify-center h-[calc(100vh-56px)] overflow-hidden">
        <div className="min-w-[300px] w-full max-w-sm p-6 flex flex-col bg-gray-50">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            {/* 完了アイコン */}
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-semibold text-center mb-4">
              請求リンクが作成されました
            </h1>

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

            {/* SNS共有セクション */}
            <div className="mt-6">
              <div className="text-sm text-gray-600 mb-3 text-center">SNSで共有</div>

              {/* Web Share API（モバイル対応） */}
              <button
                type="button"
                onClick={shareNative}
                className="w-full py-3 mb-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                共有
              </button>

              {/* SNSボタン群 */}
              <div className="grid grid-cols-3 gap-3">
                {/* LINE */}
                <button
                  type="button"
                  onClick={shareToLine}
                  className="py-3 px-4 rounded-xl bg-green-500 hover:bg-green-600 text-white font-medium transition-colors flex items-center justify-center gap-1"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                  </svg>
                  LINE
                </button>

                {/* Twitter/X */}
                <button
                  type="button"
                  onClick={shareToTwitter}
                  className="py-3 px-4 rounded-xl bg-black hover:bg-gray-800 text-white font-medium transition-colors flex items-center justify-center gap-1"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  X
                </button>

                {/* WhatsApp */}
                <button
                  type="button"
                  onClick={shareToWhatsApp}
                  className="py-3 px-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium transition-colors flex items-center justify-center gap-1"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.863 3.488"/>
                  </svg>
                  WhatsApp
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-4 w-full py-3.5 rounded-xl text-base font-medium bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 transition-colors"
            >
              トップ画面に戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestComplete;
