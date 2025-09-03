import React from 'react';

/**
 * 支払いユーザー情報表示コンポーネント
 * @param {Object} payer - 支払いユーザー情報
 * @param {string} payer.name - ユーザー名
 * @param {string} payer.icon - ユーザーアイコンのパス
 * @param {string} size - コンポーネントのサイズ ('sm', 'md', 'lg')
 * @param {string} className - 追加のCSSクラス（オプション）
 * @param {string} labelText - ラベルテキスト（デフォルト: '支払者'）
 * @param {boolean} showLabel - ラベルを表示するかどうか（デフォルト: true）
 * @param {string} align - アライメント ('left', 'right', 'center')
 */
const PayerInfo = ({
    payer,
    size = "md",
    className = "",
    labelText = "支払者",
    showLabel = true,
    align = "right"
}) => {
    if (!payer) return null;

    // サイズに応じたクラス名のマッピング
    const sizeClasses = {
        sm: {
            label: "text-xs",
            name: "text-xs",
            image: "w-6 h-6",
            spacing: "mb-0.5 ml-1.5"  // mr→mlに変更
        },
        md: {
            label: "text-xs",
            name: "text-sm",
            image: "w-8 h-8",
            spacing: "mb-1 ml-2"      
        },
        lg: {
            label: "text-sm",
            name: "text-base",
            image: "w-10 h-10",
            spacing: "mb-1.5 ml-3"    
        },
        xl: {
            label: "text-base",
            name: "text-lg",
            image: "w-12 h-12",
            spacing: "mb-2 ml-3"      
        }
    };

    // 存在しないサイズが指定された場合は md を使用
    const classes = sizeClasses[size] || sizeClasses.md;

    // アライメントの設定
    const alignClasses = {
        left: "items-start",
        right: "items-end",
        center: "items-center"
    };

    const alignClass = alignClasses[align] || alignClasses.right;

    return (
        <div className={`flex items-center ${className}`}>
            <div className={`flex flex-col ${alignClass}`}>
                {showLabel && (
                    <span className={`${classes.label} text-gray-500 mb-1`}>{labelText}</span>
                )}
                <div className="flex items-center">
                    <img
                        src={payer.icon}
                        alt={payer.name}
                        className={`${classes.image} rounded-full object-cover`}
                    />
                    <span className={`${classes.name} text-gray-700 ${classes.spacing}`}>{payer.name}</span>
                </div>
            </div>
        </div>
    );
};

export default PayerInfo;
