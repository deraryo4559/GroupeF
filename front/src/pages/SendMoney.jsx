import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button1 from '../components/button1';
import Balance from '../components/Balance';
import Header from '../components/Header';
import Icon from "../components/Icon";

function SendMoney() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [balance, setBalance] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ユーザー情報（location.state から受け取る）
  const user = state?.user ?? {
    id: 0,
    user_id: 0,  // user_idも追加
    name: "サンプル 氏名",
    avatar_path: "/images/human1.png",
    email: "",
  };

  // バックエンドから残高を取得
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/accounts/52`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Balance data:", data);  // デバッグ用
        setBalance(data.balance);
      } catch (error) {
        console.error("残高の取得に失敗:", error);
        setError("残高の取得に失敗しました");
      }
    };

    fetchBalance();
  }, []);

  // userのlimitも残高と同期
  const syncedUser = { ...user, limit: balance };

  const isAmountValid =
    amount !== "" &&
    Number(amount) >= 1 &&
    Number(amount) <= balance;

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setError(""); // 入力時にエラーメッセージをクリア

    // Use a regular expression to allow only digits (0-9).
    if (/^\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleKeyDown = (e) => {
    // 押されたキーが'e'または'E'の場合
    if (e.key === 'e' || e.key === 'E') {
      // 本来のキー入力（'e'と入力されること）をキャンセルする
      e.preventDefault();
    }
  };

  const handleSendMoney = async () => {
    if (!isAmountValid || isProcessing) return;

    setIsProcessing(true);
    setError("");

    try {
      // 送金先のIDを決定（user_idまたはidのどちらかを使用）
      const receiverId = user.user_id;

      console.log("Sending request:", {
        sender_id: 52,
        receiver_id: receiverId,
        amount: Number(amount),
        message: message,
      });

      const response = await fetch("http://localhost:5000/api/send_money/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender_id: 52,              // 自分のID
          receiver_id: receiverId,    // 送金相手のID
          amount: Number(amount),
          message: message,
        }),
      });

      console.log("HTTP Response:", response);

      // レスポンスがJSONでない場合のエラーハンドリング
      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error("サーバーからの応答が不正です");
      }

      console.log("Response JSON:", data);

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: 送金APIの呼び出しに失敗しました`);
      }

      // DB更新後の新しい残高を反映
      if (data.new_balance !== undefined) {
        setBalance(data.new_balance);
      }

      // 完了画面に遷移
      navigate("/SendMoneyComplete", {
        state: {
          user: syncedUser,
          amount,
          message,
          previousBalance: balance,
          newBalance: data.new_balance || balance,
        },
      });
    } catch (error) {
      console.error("送金エラー:", error);
      setError(error.message || "送金に失敗しました。もう一度お試しください。");
    } finally {
      setIsProcessing(false);
    }
  };

  const isOverLimit = amount !== "" && Number(amount) > balance;

  return (
    <>
      <Header title="送金" />
      <div className="flex justify-center h-screen">
        <div className="min-w-[300px] w-full max-w-sm pl-6 pr-6 flex flex-col bg-gray-50">

          {/* エラーメッセージ */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* 送金先 */}
          <div className="flex items-start mt-6">
            <div className="text-sm text-gray-600 leading-6">送金先</div>
            <div className="flex items-center gap-3 mt-4">
              <Icon
                img={user.avatar_path}
                name={user.name}
              />
            </div>
          </div>

          {/* 送金上限額 */}
          <Balance balance={balance} label="送金上限額" />

          {/* 送金金額 */}
          <div className="relative mt-6">
            {/* 入力欄の枠線にラベルを重ねるためのコンテナ
    peer-placeholder-shown を使って、入力中はラベルを上に移動させる
  */}
            <div className="absolute left-3 -top-2.5 z-10">
              <label
                htmlFor="amount"
                className="bg-gray-50 px-1 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-blue-500"
              >
                送金金額
              </label>
            </div>

            <div className="relative flex items-center">
              <input
                id="amount"
                type="number"
                inputMode="numeric"
                min="1"
                max={balance}
                step="1"
                placeholder=" " // ラベルのアニメーションのために半角スペースを入れる
                value={amount}
                onChange={handleAmountChange}
                onKeyDown={handleKeyDown}
                // peerクラスを追加して、ラベルがinputの状態を検知できるようにする
                className={`peer w-full rounded-xl border bg-white p-4 text-2xl font-bold text-gray-900 shadow-sm transition-colors focus:outline-none focus:ring-2
        ${isOverLimit
                    ? "border-red-500 focus:ring-red-500 text-red-600"
                    : "border-gray-300 focus:ring-blue-500"
                  }
      `}
              />
              <span
                className={`absolute right-4 text-lg font-medium transition-colors
        ${isOverLimit ? "text-red-500" : "text-gray-500"}
      `}
              >
                円
              </span>
            </div>
          </div>

          <div className="min-h-6 flex items-center pt-1 overflow-hidden"> {/* 高さを予約するためのコンテナ */}
            {isOverLimit && (
              <div className="flex items-center space-x-1 animate-fadeIn">
                {/* 小さな警告アイコン */}
                <svg className="h-4 w-4 flex-shrink-0 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-12a1 1 0 102 0V7a1 1 0 10-2 0v-1zm1 4a1 1 0 100 2h.01a1 1 0 100-2H10z" clipRule="evenodd" />
                </svg>
                {/* 警告テキスト */}
                <p className="text-red-600 text-xs font-medium">
                  送金上限額を超過しています
                </p>
              </div>
            )}
          </div>

          {/* メッセージ（任意） */}
          <div>
            <div className="text-sm text-gray-600 leading-6 mb-2">メッセージ（任意）</div>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="メッセージを入力してください"
              className="w-full pl-4 pr-4 py-3 text-[15px] md:text-base rounded-xl border border-gray-300 bg-white placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>



          {/* 送金ボタン */}
          <div className="mt-6 flex justify-center">
            <Button1
              className={`mt-6 w-full py-3.5 rounded-xl text-white text-[15px] md:text-base font-medium shadow-inner transition-colors 
            ${isAmountValid && !isProcessing ? "bg-blue-500 hover:bg-blue-600 cursor-pointer" : "bg-gray-300 cursor-not-allowed"}`}
              variant='primary'
              disabled={!isAmountValid || isProcessing}
              onClick={handleSendMoney}
            >
              {isProcessing ? "送金中..." : "送金"}
            </Button1>
          </div>

        </div>
      </div>
    </>
  );
}

export default SendMoney;