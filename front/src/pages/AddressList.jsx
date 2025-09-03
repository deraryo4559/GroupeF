import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import Button1 from '../components/button1';
import Header from '../components/Header';

function AddressList() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const saved = sessionStorage.getItem("authUser");
    const me = saved ? JSON.parse(saved) : null;
    const myId = me?.user_id ?? 52;

    fetch(`http://localhost:5000/api/users?exclude_id=${myId}`)
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
      <div className="flex justify-center h-screen">
        <div className="min-w-[300px] w-full max-w-sm pl-6 pr-6 flex flex-col bg-gray-50">
          <ul className="space-y-3 bg-white rounded-xl shadow-sm p-4">
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
      </div>
    </>
  );
}

export default AddressList;
