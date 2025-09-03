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
    setError(""); // エラーをクリア
    
    if (value === "") {
      setAmount("");
      return;
    }
    
    const num = Number(value);
    if (num < 1) {
      setAmount("1");
      return;
    }
    
    if (num > balance) {
      setError("残高を超えています");
    }
    
    setAmount(value);
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

  return (
    <>
      <Header title="送金" />
      <div className="flex justify-center">
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
          <div className="mt-4">
            <div className="text-sm text-gray-600 leading-6 mb-2">送金金額</div>
            <div className="relative">
              <input
                type="number"
                inputMode="numeric"
                min="1"
                max={balance}
                step="1"
                placeholder="金額"
                value={amount}
                onChange={handleAmountChange}
                className="w-full pr-10 pl-4 py-3 text-[15px] md:text-base rounded-xl border border-gray-300 bg-white placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm md:text-base">円</span>
            </div>
          </div>

          {/* メッセージ（任意） */}
          <div className="mt-4">
            <div className="text-sm text-gray-600 leading-6 mb-2">メッセージ（任意）</div>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="メッセージを入力してください"
              className="w-full pl-4 pr-4 py-3 text-[15px] md:text-base rounded-xl border border-gray-300 bg-white placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          {/* デバッグ情報（開発時のみ表示） */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-2 p-2 bg-gray-100 text-xs">
              Debug: user.id={user.id}, user.user_id={user.user_id}, balance={balance}
            </div>
          )}

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