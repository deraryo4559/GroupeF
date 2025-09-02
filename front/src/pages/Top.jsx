import React from 'react';
import Button1 from '../components/button1';
import Icon from '../components/Icon';

const Top = () => {
    return (
        <div className="flex justify-center">
            <div className="max-w-sm w-full p-6 flex flex-col justify-center">
                <div>
                    <h2 className="text-xl font-bold text-center text-gray-800 mb-6">
                        お客様情報
                    </h2>
                    <Icon
                        img="\images\human1.png"
                        name="サンプル氏名"
                    />
                    <div>
                        {/* 口座番号表示 */}
                        <div className="mb-4">
                            <p className="text-sm text-gray-600">口座番号：〇〇〇〇〇〇</p>
                        </div>

                        {/* 預金残高表示 */}
                        <div>
                            <p className="text-sm text-gray-600">預金残高</p>
                            <p className="text-2xl font-bold text-gray-900 flex justify-end">50,000円</p>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-center">
                        <Button1 navigateTo="/step3" className="w-full">
                            送金する
                        </Button1>
                    </div>
                    <div className="mt-6 flex justify-center">
                        <Button1 navigateTo="/request" className="w-full" variant='danger'>
                            請求する
                        </Button1>
                    </div>
                    <div className="mt-6 flex justify-center">
                        <Button1 navigateTo="/billing-status" className="w-full" variant='secondary'>
                            請求ステータス
                        </Button1>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Top;