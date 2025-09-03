import React from 'react';

/**
 * アイコン付きメニューボタンコンポーネント
 * @param {Object} props
 * @param {string} props.label - ボタンのラベルテキスト
 * @param {React.ReactNode} props.icon - SVGアイコン要素
 * @param {string} props.bgColor - アイコン背景色のクラス名 (例: "bg-red-100")
 * @param {string} props.textColor - アイコン色のクラス名 (例: "text-red-600")
 * @param {function} props.onClick - クリック時のコールバック関数
 * @returns {JSX.Element}
 */
const MenuIconButton = ({ label, icon, bgColor, textColor, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white p-3 text-center shadow-sm border border-gray-100"
        >
            <div className={`grid place-content-center ${bgColor} ${textColor} rounded-full size-11`}>
                {icon}
            </div>
            <span className="text-gray-800 text-sm font-semibold">{label}</span>
        </button>
    );
};

export default MenuIconButton;
