import React from 'react';
import Button1 from '../components/Button1'

const Top = () => {
    return (
        <div className="bg-gray-100 flex justify-center min-h-screen p-4 font-sans">
            <div className="max-w-sm w-full bg-white rounded-xl shadow-lg p-6 flex flex-col justify-center">
                <div>
                    <h2 className="text-xl font-bold text-center text-gray-800 mb-6">
                        お客様情報
                    </h2>
                    <div className="flex items-start gap-4">
                        <img
                            src="../images/human1.png"
                            alt="ユーザーアイコン"
                            className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex flex-col">
                            <p className="text-lg font-semibold text-gray-900">
                                サンプル 氏名
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                口座番号：〇〇〇〇〇〇
                            </p>
                            <p className="text-xs text-gray-400 mt-3">
                                預金残高
                            </p>
                            <p className="text-2xl font-bold text-green-600">
                                50,000円
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-center">
                    <Button1 navigateTo="/step3" className="w-full">
                        送金する
                    </Button1>
                </div>
            </div>
        </div>
    );
};

export default Top;