// UserInfoCardStatic.jsx (クリック動作を無効にした静的バージョン)
import React from 'react';

const UserInfoCardStatic = ({ userName, userId, accountNumber, avatarPath }) => {
    return (
        <section className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-20 w-20 shrink-0"
                style={{ backgroundImage: `url(${avatarPath})` }}
            >
            </div>
            <div>
                <p className="text-gray-900 text-xl font-bold leading-tight">{userName}</p>
                <p className="text-gray-500 text-sm">@user_{userId || "sample"}</p>
                <p className="text-gray-500 text-sm">口座番号: {accountNumber}</p>
            </div>
        </section>
    );
};

export default UserInfoCardStatic;
