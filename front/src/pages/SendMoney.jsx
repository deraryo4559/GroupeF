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

  // ユーザー情報（location.state から受け取る）
  const user = state?.user ?? {
    id: 0,
    name: "サンプル 氏名",
    avatar_path: "/images/human1.png",
    email: "",
  };


  // 🔹 バックエンドから残高を取得
  useEffect(() => {
    if (!user.user_id) return;

    fetch(`http://localhost:5000/api/accounts/52`)
      .then(response => {
        if (!response.ok) {
          throw new Error("口座情報の取得に失敗しました");
        }
        return response.json();
      })
      .then(data => {
        setBalance(data.balance); // DBから取得した残高を反映
      })
      .catch(error => {
        console.error("残高の取得に失敗:", error);
      });
  }, [user.id]);


  // userのlimitも残高と同期
  const syncedUser = { ...user, limit: balance };

  const isAmountValid =
    amount !== "" &&
    Number(amount) >= 1 &&
    Number(amount) <= balance; // 残高以下であることをチェック

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === "") return setAmount("");
    const num = Number(value);
    if (num < 1) return setAmount("1");
    setAmount(value);
  };

  const handleSendMoney = async () => {
    if (!isAmountValid || isProcessing) return;
    setIsProcessing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const sendAmount = Number(amount);
      const newBalance = balance - sendAmount;

      // 残高をローカルストレージに保存
      localStorage.setItem('userBalance', newBalance.toString());
      setBalance(newBalance);

      // 送金完了画面に遷移（残高情報も渡す）
      navigate("/SendMoneyComplete", {
        state: {
          user: syncedUser,
          amount,
          message,
          previousBalance: balance,
          newBalance: newBalance
        }
      });
    } catch (error) {
      alert("送金に失敗しました。もう一度お試しください。");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Header title="送金" />
      <div className="flex justify-center h-screen">
        <div className="min-w-[300px] w-full max-w-sm p-6 flex flex-col justify-center bg-gray-50">
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
