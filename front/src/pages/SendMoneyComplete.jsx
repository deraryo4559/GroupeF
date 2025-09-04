import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button1 from '../components/button1';
import Header from '../components/Header';

const SendMoneyComplete = () => {
  const navigate = useNavigate();

    const handleBackToHome = () => {
        navigate('/');
    };

  return (
    <div className="fixed inset-0 overflow-hidden bg-white">
      <Header title="送金完了" backTo="/" />
      <div className="flex justify-center h-[calc(100vh-56px)] overflow-hidden">
        <div className="min-w-[300px] w-full max-w-sm p-6 flex flex-col bg-gray-50">
          <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center">
            {/* 完了アイコン */}
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6">
                        <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>

            {/* 完了メッセージ */}
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">送金完了</h1>
            <p className="text-gray-600 text-center mb-6">送金処理が正常に完了しました。</p>

            {/* アクション */}
            <div className="w-full space-y-3">
              <Button1 navigateTo="/" className="w-full">
                ホームに戻る
              </Button1>
              <button
                type="button"
                onClick={() => navigate('/TransactionsList')}
                className="w-full py-3 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-800 font-medium"
              >
                取引履歴を確認
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendMoneyComplete;
