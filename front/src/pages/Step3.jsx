import React from 'react';
import { useNavigate } from 'react-router-dom';

// 公開フォルダに置いた想定（/public/images/...）
const users = [
  { id: 1, name: '田中 太郎', icon: '/images/human1.png', email: 'taro@example.com', limit: 50000 },
  { id: 2, name: '鈴木 花子', icon: '/images/human2.png', email: 'hanako@example.com', limit: 50000 },
  { id: 3, name: '佐藤 次郎', icon: '/images/human3.png', email: 'jiro@example.com', limit: 50000 },
  { id: 4, name: '高橋 三郎', icon: '/images/human4.png', email: 'saburo@example.com', limit: 50000 },
];

function Step3() {
  const navigate = useNavigate();

  const handleSelect = (user) => {
    // ★ ユーザー全データを state で渡す
    navigate('/SendMoney', { state: { user } });
  };

  return (
    <div className="p-6 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">送金相手を選択</h1>
      <ul className="space-y-3">
        {users.map((user) => (
          <li
            key={user.id}
            className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => handleSelect(user)}
          >
            <img src={user.icon} alt={user.name} className="w-10 h-10 rounded-full mr-4" />
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Step3;
