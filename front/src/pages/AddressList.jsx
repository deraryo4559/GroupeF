import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import Button1 from '../components/button1';

function AddressList() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/users/')
      .then(response => {
        if (!response.ok) {
          throw new Error('データの取得に失敗しました');
        }
        return response.json();
      })
      .then(data => {
        setUsers(data);
      })
      .catch(error => {
        console.error("ユーザーリストの取得に失敗:", error);
      });
  }, []);

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
            key={user.user_id}
            className="p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => handleSelect(user)}
          >
            {/*Icon コンポーネント*/}
            <Icon img={user.avatar_path} name={user.name} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AddressList;
