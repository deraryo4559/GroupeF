import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import Button1 from '../components/button1';
import Header from '../components/Header';

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
    <>
      <Header title="送金相手を選択" backTo="/" />
      <div className="p-6 pt-16 font-sans">
        <ul className="space-y-3 max-w-md mx-auto">
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
    </>
  );
}

export default AddressList;
