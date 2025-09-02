import React from 'react';

/**
 * 支払いユーザー情報表示コンポーネント
 * @param {Object} payer - 支払いユーザー情報
 * @param {string} payer.name - ユーザー名
 * @param {string} payer.icon - ユーザーアイコンのパス
 * @param {string} className - 追加のCSSクラス（オプション）
 */
const PayerInfo = ({ payer, className = "" }) => {
    if (!payer) return null;

    return (
        <div className={`flex items-center ${className}`}>
            <div className="flex flex-col items-end">
                <span className="text-xs text-gray-500 mb-1">支払者</span>
                <div className="flex items-center">
                    <span className="text-sm text-gray-700 mr-2">{payer.name}</span>
                    <img
                        src={payer.icon}
                        alt={payer.name}
                        className="w-8 h-8 rounded-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default PayerInfo;
