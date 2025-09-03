import React from 'react';

/**
 * アカウント残高カードコンポーネント
 * 
 * @param {Object} props
 * @param {number} props.balance - 表示する残高
 * @param {string} props.label - 残高ラベル (デフォルト: "残高")
 * @param {string} props.bgColor - 背景色クラス (デフォルト: "bg-gradient-to-r from-red-500 to-red-400")
 * @returns {JSX.Element}
 */
const BalanceCard = ({
    balance,
    label = "残高",
    bgColor = "bg-gradient-to-r from-red-500 to-red-400"
}) => {
    // 数値の場合はtoLocaleStringを使用、文字列の場合はそのまま表示
    const formattedBalance = typeof balance === 'number'
        ? `¥${balance.toLocaleString()}`
        : balance;

    return (
        <section className={`${bgColor} p-5 rounded-2xl shadow-sm text-white`}>
            <div className="flex justify-between items-center">
                <h2 className="text-white text-sm font-medium">{label}</h2>
            </div>
            <p className="text-white text-4xl font-bold mt-2">{formattedBalance}</p>
        </section>
    );
};

export default BalanceCard;
