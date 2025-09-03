import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Button1 from "./button1";
import Botton1 from './button1';

function RequestLink() {
  const [reqAmount, setReqAmount] = useState("");
  const [displayAmount, setDisplayAmount] = useState(""); // 表示用金額（カンマ区切り）
  const [reqMsg, setReqMsg] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [userName, setUserName] = useState("ユーザー名");
  const navigate = useNavigate();

  // 現在の日付と時間を設定
  useEffect(() => {
    const now = new Date();
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    setCurrentDate(now.toLocaleDateString('ja-JP', dateOptions));
    setCurrentTime(now.toLocaleTimeString('ja-JP', timeOptions));

    // ユーザー情報を取得 (ダミー)
    const fetchUserName = async () => {
      try {
        // APIから取得する場合はこちらに実装
        // 仮のデータ
        setUserName("サンプル氏名");
      } catch (error) {
        console.error("ユーザー情報の取得に失敗:", error);
      }
    };

    fetchUserName();
  }, []);

  // 金額入力の処理 - カンマ区切り対応版
  const handleAmountChange = (e) => {
    // 入力値から数字以外の文字（カンマや記号など）をすべて除去
    const rawValue = e.target.value.replace(/[^\d]/g, '');

    if (rawValue === "") {
      setReqAmount("");
      setDisplayAmount("");
      return;
    }

    // 数値としてのチェック
    const numValue = Number(rawValue);
    if (numValue < 1) {
      setReqAmount("1");
      setDisplayAmount("1");
      return;
    }

    if (numValue > 1000000) {
      setReqAmount("1000000");
      setDisplayAmount("1,000,000");
      return;
    }

    // 内部的な値は数値のまま保存
    setReqAmount(rawValue);

    // 表示用の値はカンマ区切りにフォーマット
    setDisplayAmount(Number(rawValue).toLocaleString());
  };

  const canCreate =
    reqAmount !== "" && Number(reqAmount) >= 1 && Number(reqAmount) <= 1000000;

  // 生成した請求リンクを持って完了画面へ遷移
  const handleCreate = () => {
    const id = Math.random().toString(36).slice(2, 10);
    const link = `${window.location.origin}/pay/${id}`; // ダミーの請求リンク
    navigate("/request/complete", { state: { link, amount: reqAmount, msg: reqMsg } });
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-white">
      {/* ヘッダー */}
      <Header title="請求リンクの作成" backTo="/" />

      {/* メインとフッターを含むフレックスコンテナ */}
      <div className="flex flex-col justify-between h-[calc(100vh-56px)] max-w-sm mx-auto bg-gray-50">
        {/* メインコンテンツ */}
        <main className="p-6 space-y-8 overflow-y-auto">
          <div className="space-y-6">
            {/* 金額入力 */}
            <div className="space-y-4 text-center">
              <label className="text-gray-700 text-sm font-medium" htmlFor="amount">
                請求金額
              </label>
              <div className="relative flex items-center justify-center">
                <div className="relative w-full">
                  <span className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 text-3xl md:text-4xl font-bold pointer-events-none">
                    ¥
                  </span>
                  <input
                    id="amount"
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={displayAmount}
                    onChange={handleAmountChange}
                    className="w-full py-3 px-14 rounded-none border-0 border-b-2 border-gray-200 bg-transparent text-center text-4xl md:text-5xl font-extrabold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-red-500 focus:ring-0"
                  />
                </div>
              </div>
            </div>

            {/* メッセージ入力 */}
            <div className="space-y-2">
              <label className="text-gray-700 text-sm font-medium" htmlFor="note">
                メッセージ（任意）
              </label>
              <textarea
                id="note"
                rows={3}
                value={reqMsg}
                onChange={(e) => setReqMsg(e.target.value)}
                placeholder="ランチ代、買い物代など"
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-100 p-4 text-base font-normal leading-normal text-gray-800 placeholder:text-gray-500 "
              />
            </div>
          </div>

          {/* 詳細情報 */}
          <div className="space-y-4">
            <div className="bg-gray-100/60 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-gray-600 text-sm">請求者</p>
                <p className="text-gray-900 font-semibold">あなた（{userName}）</p>
              </div>
              <div className="border-t border-gray-200 my-2"></div>
              <div className="flex justify-between items-center">
                <p className="text-gray-600 text-sm">日付</p>
                <p className="text-gray-900 font-semibold">{currentDate}</p>
              </div>
              <div className="border-t border-gray-200 my-2"></div>
              <div className="flex justify-between items-center">
                <p className="text-gray-600 text-sm">時間</p>
                <p className="text-gray-900 font-semibold">{currentTime}</p>
              </div>
            </div>
          </div>
        </main>

        {/* フッター（ボタン） */}
        <footer className="p-4 bg-white border-t border-gray-200 sticky bottom-0 left-0 right-0">
          <Button1
            variant="danger"
            size="large"
            onClick={handleCreate}
            disabled={!canCreate}
            className="w-full h-14 rounded-full flex items-center justify-center font-bold tracking-wide"
          >
            リンクを生成
          </Button1>
        </footer>
      </div>
    </div>
  );
}

export default RequestLink;
