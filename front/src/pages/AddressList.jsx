import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import Button1 from '../components/button1';

// 公開フォルダに置いた想定（/public/images/...）
const users = [
  { id: 1, name: '田中 太郎', icon: '/images/human1.png', email: 'taro@example.com', limit: 50000 },
  { id: 2, name: '鈴木 花子', icon: '/images/human2.png', email: 'hanako@example.com', limit: 50000 },
  { id: 3, name: '佐藤 次郎', icon: '/images/human3.png', email: 'jiro@example.com', limit: 50000 },
  { id: 4, name: '高橋 三郎', icon: '/images/human4.png', email: 'saburo@example.com', limit: 50000 },
];

function AddressList() {
  const navigate = useNavigate();

  const handleSelect = (user) => {
    navigate('/SendMoney', { state: { user } });
  };

  return (
    <div className="p-6 font-sans">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4 text-blue-600">送金相手を選択</h1>
        <Button1 
          variant="outline" 
          size="small" 
          navigateTo="/"
          className="mb-4"
        >
          ← Top画面に戻る
        </Button1>
      </div>
      <ul className="space-y-3">
        {users.map((user) => (
          <li
            key={user.id}
            className="p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => handleSelect(user)}
          >
            {/*Icon コンポーネント*/}
            <Icon img={user.icon} name={user.name} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AddressList;
