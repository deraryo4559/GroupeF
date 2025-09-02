import React from "react";

const Balance = ({ balance, label = "預金残高", highlight = false }) => {
  return (
    <div className="mt-4">
      {/* ラベル */}
      <div className="text-sm text-gray-600 mb-1">{label}</div>

      {/* 残高ボックス */}
      <div
        className={`w-full px-4 py-2 rounded-xl text-right font-semibold ${
          highlight ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-900"
        }`}
      >
        {balance.toLocaleString()}円
      </div>
    </div>
  );
};

export default Balance;
