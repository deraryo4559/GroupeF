import React from "react";
import { Wallet, TrendingUp } from "lucide-react";

const Balance = ({
  balance,
  label = "預金残高",
  highlight = false
}) => {
  return (
    <div className="relative">
      {/* グラデーション背景とボーダー */}
      <div
        className={`
          relative overflow-hidden rounded-2xl shadow-lg border transition-all duration-300 hover:shadow-xl
          ${highlight
            ? "bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 hover:from-green-100 hover:to-emerald-200"
            : "bg-gradient-to-br from-slate-50 to-red-200 border-gray-200 hover:from-white hover:to-gray-50"
          }
        `}
      >
        {/* 装飾的な円形背景 */}
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>

        {/* コンテンツエリア */}
        <div className="relative p-4">
          {/* ヘッダー部分 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div
                className={`
                  p-2 rounded-lg transition-colors duration-200
                  ${highlight
                    ? "bg-green-200/50 text-green-700"
                    : "bg-gray-200/50 text-gray-600"
                  }
                `}
              >
                <Wallet size={16} />
              </div>
              <span
                className={`
                  text-sm font-medium tracking-wide
                  ${highlight ? "text-green-700" : "text-gray-600"}
                `}
              >
                {label}
              </span>
            </div>
          </div>

          {/* 残高表示 */}
          <div className="text-right">
            <div
              className={`
                text-3xl font-bold tracking-tight mb-1 transition-colors duration-200
                ${highlight
                  ? "text-green-800"
                  : "text-gray-900"
                }
              `}
            >
              {balance.toLocaleString()}
              <span
                className={`
                  text-lg font-medium ml-1
                  ${highlight ? "text-green-600" : "text-gray-600"}
                `}
              >
                円
              </span>
            </div>

            {/* サブテキスト */}
            <div
              className={`
                text-xs font-medium uppercase tracking-wider
                ${highlight ? "text-green-600/80" : "text-gray-500"}
              `}
            >
              Available Balance
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Balance;