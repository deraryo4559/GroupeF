import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button1 from '../components/button1';

function SendMoney() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // ★ 受け取ったユーザー（全データ）。なければデフォルト
  const user = state?.user ?? {
    id: 0,
    name: "サンプル 氏名",
    icon: "/images/human1.png",
    email: "",
    limit: 50000,
  };

  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const isAmountValid =
    amount !== "" && Number(amount) >= 1 && Number(amount) <= (user.limit ?? 50000);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === "") return setAmount("");
    const num = Number(value);
    const max = user.limit ?? 50000;
    if (num < 1) return setAmount("1");
    if (num > max) return setAmount(String(max));
    setAmount(value);
  };

  // 送金ボタンがクリックされたときの処理
  const handleSendMoney = () => {
    if (isAmountValid) {
      navigate("/SendMoneyComplete", { state: { user, amount, message } });
    }
  };

  // 請求ボタンがクリックされたときの処理
  const handleRequestMoney = () => {
    navigate("/request", { state: { user } });
  };

  return (
    <div className="w-full max-w-xs md:max-w-md lg:max-w-lg mx-auto p-6 bg-white rounded-xl shadow text-gray-800">
      {/* 送金先 */}
      <div className="flex items-start gap-4">
        <div className="text-sm text-gray-600 leading-6 mt-1">送金先</div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center">
            <img
              src={user.icon}
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

      {/* 送金上限額（ユーザーごとに可変にしたい場合は user.limit を使用） */}
      <div className="flex items-start gap-4 mt-6">
        <div className="text-sm text-gray-600 leading-6 mt-1">送金上限額</div>
        <div className="text-[15px] md:text-base font-semibold tracking-wide">
          {(user.limit ?? 50000).toLocaleString()}円
        </div>
      </div>

      {/* 送金金額 */}
      <div className="mt-6">
        <div className="text-sm text-gray-600 leading-6 mb-2">送金金額</div>
        <div className="relative">
          <input
            type="number"
            inputMode="numeric"
            min="1"
            max={user.limit ?? 50000}
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
       <Button1 className={`mt-6 w-full py-3.5 rounded-xl text-white text-[15px] md:text-base font-medium shadow-inner transition-colors 
          ${isAmountValid ? "bg-blue-500 hover:bg-blue-600 cursor-pointer" : "bg-gray-300 cursor-not-allowed"}`} variant='primary' disabled={!isAmountValid} >
        送金
       </Button1>
    </div>

    </div>
  );
}

export default SendMoney;