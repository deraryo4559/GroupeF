import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

function RequestLink() {
  const [reqAmount, setReqAmount] = useState("3000");
  const [reqMsg, setReqMsg] = useState("飲み会代お願いします！");
  const navigate = useNavigate();

  const handleAmountChange = (e) => {
    const v = e.target.value;
    if (v === "") return setReqAmount("");
    const n = Number(v);
    if (n < 1) return setReqAmount("1");
    if (n > 50000) return setReqAmount("50000");
    setReqAmount(v);
  };

  const canCreate =
    reqAmount !== "" && Number(reqAmount) >= 1 && Number(reqAmount) <= 50000;

  // ★ APIに保存して、返ってきたデータで完了画面へ遷移
  const handleCreate = async () => {
    // ログイン中ユーザーIDを sessionStorage から取得
    const saved = sessionStorage.getItem("authUser");
    const me = saved ? JSON.parse(saved) : null;
    const requester_user_id = me?.user_id ?? 52; // fallbackで52

    try {
      const res = await fetch("http://localhost:5000/api/requests/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requester_user_id,
          amount: Number(reqAmount),
          message: reqMsg,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        console.error("請求作成失敗:", data);
        alert("請求作成に失敗しました");
        return;
      }

      const { link, amount, message } = data.request;

      // 完了画面へ遷移（サーバー返却の正式データを使う）
      navigate("/request/complete", {
        state: { link, amount, msg: message },
      });
    } catch (err) {
      console.error("通信エラー:", err);
      alert("通信エラーが発生しました");
    }
  };

  return (
    <>
      <Header title="請求リンクの作成" backTo="/" />
      <div className="min-h-screen pt-20 px-4 pb-8 bg-gray-50">
        <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-sm p-6 text-gray-800">
          <div className="text-sm text-gray-600 leading-6 mb-2">請求リンクの作成</div>

          {/* 請求金額 */}
          <div className="mt-2">
            <div className="text-sm text-gray-600 leading-6 mb-2">請求金額</div>
            <div className="relative">
              <input
                type="number"
                inputMode="numeric"
                min="1"
                max="50000"
                step="1"
                placeholder="金額"
                value={reqAmount}
                onChange={handleAmountChange}
                className="w-full pr-10 pl-4 py-3 text-[15px] md:text-base rounded-xl border border-gray-300 bg-white placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm md:text-base">円</span>
            </div>
          </div>

          {/* メッセージ（任意） */}
          <div className="mt-6">
            <div className="text-sm text-gray-600 leading-6 mb-2">メッセージ（任意）</div>
            <textarea
              rows={3}
              value={reqMsg}
              onChange={(e) => setReqMsg(e.target.value)}
              className="w-full pl-4 pr-4 py-3 text-[15px] md:text-base rounded-xl border border-gray-300 bg-white placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none"
            />
          </div>

          {/* 作成ボタン */}
          <button
            type="button"
            disabled={!canCreate}
            onClick={handleCreate}  // ★ここを変更
            className={`mt-6 w-full py-3.5 rounded-xl text-white text-[15px] md:text-base font-medium shadow-inner transition-colors
              ${canCreate ? "bg-red-500 hover:bg-red-600 cursor-pointer" : "bg-gray-300 cursor-not-allowed"}`}
          >
            リンクを作成
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-3 w-full py-3.5 rounded-xl text-[15px] md:text-base font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
          >
            ← Topに戻る
          </button>
        </div>
      </div>
    </>
  );
}

export default RequestLink;
