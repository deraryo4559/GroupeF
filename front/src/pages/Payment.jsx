import React from 'react';
import Button1 from '../components/button1';
import Icon from '../components/Icon';

const Payment = () => {
      const reqMsg = "飲み会代お願いします！";
    
    return (
        <div className="flex justify-center">
            <div className="max-w-sm w-full p-6 flex flex-col justify-center">
                <div>
                    <h2 className="text-xl font-bold text-center text-gray-800 mb-6">
                        支払う
                    </h2>
                    <Icon
                        img="\images\human1.png"
                        name="サンプル氏名"
                    />
                    <div>


      <div className="mt-6">
        <div className="text-sm text-gray-600 leading-6 mb-2">メッセージ（任意）</div>
        <textarea
          rows={3}
          value={reqMsg}
          className="w-full pl-4 pr-4 py-3 text-[15px] md:text-base rounded-xl border border-gray-300 bg-white placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none"
        />
      </div>

                        {/* 支払額表示 */}
                        <div>
                            <p className="text-sm text-gray-600">支払額</p>
                            <p className="text-2xl font-bold text-gray-900 flex justify-end">50,000円</p>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-center">
                        <Button1 navigateTo="/payment/complete" className="w-full">
                            支払う
                        </Button1>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Payment;