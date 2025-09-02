import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button1 from '../components/button1';
import Balance from '../components/Balance';
import Header from '../components/Header';

function SendMoney() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // 残高の状態管理
  const [balance, setBalance] = useState(50000);
  const [isProcessing, setIsProcessing] = useState(false);

  // ローカルストレージから残高を読み込み
  useEffect(() => {
    const savedBalance = localStorage.getItem('userBalance');
    if (savedBalance) {
      setBalance(Number(savedBalance));
    }
  }, []);

  // ★ 受け取ったユーザー（全データ）。limitを残高と同じに設定
  const user = state?.user ?? {
    id: 0,
    name: "サンプル 氏名",
    icon: "/images/human1.png",
    email: "",
    limit: balance, // limitを残高と同じに設定
  };

  // userのlimitも残高と同期
  const syncedUser = {
    ...user,
    limit: balance
  };

  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const isAmountValid =
    amount !== "" &&
    Number(amount) >= 1 &&
    Number(amount) <= balance; // 残高以下であることをチェック

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === "") return setAmount("");
    const num = Number(value);
    if (num < 1) return setAmount("1");
    // 残高を超える金額でも入力を許可（警告表示のため）
    setAmount(value);
  };

  // 送金ボタンがクリックされたときの処理
  const handleSendMoney = async () => {
    if (!isAmountValid || isProcessing) return;

    setIsProcessing(true);

    try {
      // 送金処理のシミュレーション
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

  // 請求ボタンがクリックされたときの処理
  const handleRequestMoney = () => {
    navigate("/request", { state: { user: syncedUser } });
  };

  return (
    <>
      <Header title="送金" />
      <div className="w-full max-w-xs md:max-w-md lg:max-w-lg mx-auto p-6 bg-white rounded-xl shadow text-gray-800">
        {/* 送金先 */}
        <div className="flex items-start gap-4">
          <div className="text-sm text-gray-600 leading-6 mt-1">送金先</div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center">
              <img
                src={user.avatar_path}
                alt={user.name}
                className="w-12 h-12 object-cover rounded-full"
              />
            </div>
            {/* ★ 選択した相手の名前を表示 */}
            <div className="text-[15px] md:text-base font-medium tracking-wide">
              {user.name}
            </div>
          </div>
        </div>

        {/* 送金上限額 */}
        <Balance balance={balance} label="送金上限額" />

        {/* 現在の残高 */}
        <Balance balance={balance} label="現在の残高" highlight />


        {/* 送金金額 */}
        <div className="mt-6">
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
        <div className="mt-6">
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
    </>
  );
}

export default SendMoney;