import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

/**
 * スマホアプリのようなヘッダーコンポーネント
 * 
 * @param {Object} props
 * @param {string} props.title - ヘッダーのタイトル
 * @param {boolean} props.showBackButton - 戻るボタンを表示するかどうか (デフォルト: true)
 * @param {string} props.backTo - 戻るボタンが特定のURLに戻る場合に指定
 * @param {Function} props.onBackClick - 戻るボタンのカスタムクリックハンドラ
 * @param {React.ReactNode} props.rightAction - ヘッダー右側に表示するアクション要素
 * @param {string} props.className - 追加のカスタムクラス
 * 
 * 使用例:
 * // 基本的な使用方法（戻るボタンあり）
 * <Header title="ページタイトル" />
 * 
 * // 戻るボタンなしで使用（トップページなど）
 * <Header title="ホーム" showBackButton={false} />
 * 
 * // 特定のURLに戻るボタン
 * <Header title="詳細ページ" backTo="/list" />
 * 
 * // カスタムの戻る処理
 * <Header title="編集" onBackClick={() => confirmLeave()} />
 */
function Header({
    title,
    showBackButton = true,
    backTo,
    onBackClick,
    rightAction,
    className = "",
}) {
    const navigate = useNavigate();
    const location = useLocation();
    const [pageTitle, setPageTitle] = useState(title);

    // タイトルがない場合、現在のパスからタイトルを推測
    useEffect(() => {
        if (!title) {
            const path = location.pathname;

            // パスに基づいてタイトルを設定
            const pathToTitle = {
                '/': 'ホーム',
                '/SendMoney': '送金',
                '/SendMoneyComplete': '送金完了',
                '/request': 'リクエスト',
                '/request/complete': 'リクエスト完了',
                '/step3': 'アドレス一覧',
                '/billing-status': '請求状況',
                '/payment': '支払い',
                '/payment/complete': '支払い完了',
            };

            setPageTitle(pathToTitle[path] || 'アプリ');
        }
    }, [title, location.pathname]);

    const handleBackClick = () => {
        if (onBackClick) {
            onBackClick();
        } else if (backTo) {
            navigate(backTo);
        } else {
            navigate(-1);
        }
    };

    return (
        <header className={`fixed top-0 left-0 right-0 bg-white shadow-sm z-10 ${className}`}>
            <div className="flex items-center justify-between h-14 px-4">
                {/* 戻るボタン */}
                {showBackButton && (
                    <button
                        onClick={handleBackClick}
                        className="w-10 h-10 flex items-center justify-center text-gray-700"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>
                )}

                {/* タイトル */}
                <h1 className={`text-lg font-medium text-center flex-1 ${showBackButton ? 'ml-2' : 'ml-10'}`}>
                    {pageTitle}
                </h1>

                {/* 右側の調整 */}
                <div className="w-10 flex justify-end">
                </div>
            </div>
        </header>
    );
}

export default Header;
