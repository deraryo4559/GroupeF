import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import Button1 from '../components/button1';
import Header from '../components/Header';

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
    <>
      <Header title="送金相手を選択" backTo="/" />
      <div className="p-6 font-sans">
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
    </>
  );
}

export default AddressList;
