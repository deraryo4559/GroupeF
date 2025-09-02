import React from 'react';

/**
 * 請求情報の表示コンポーネント
 * @param {Object} billing - 請求情報
 * @param {number} billing.amount - 請求金額
 * @param {string} billing.message - 請求メッセージ（オプション）
 * @param {string} billing.createdAt - 請求作成日時
 * @param {function} formatDate - 日付フォーマット関数
 * @param {Object} statusStyle - ステータス表示用スタイル情報
 */
const BillingInfo = ({ billing, formatDate, statusStyle }) => {
    return (
        <div className="flex-1">
            <div className="flex items-center">
                <span className="font-semibold text-lg text-gray-900">
                    {billing.amount.toLocaleString()}円
                </span>
                <span className={`ml-3 text-xs px-2 py-1 rounded-full ${statusStyle.bgColor} ${statusStyle.textColor}`}>
                    {statusStyle.label}
                </span>
            </div>
            {billing.message && (
                <p className="text-gray-600 text-sm mt-1">
                    {billing.message}
                </p>
            )}
            <p className="text-gray-500 text-xs mt-1">
                {formatDate(billing.createdAt)}
            </p>
        </div>
    );
};

export default BillingInfo;
