// src/pages/AddressList.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
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
    <div className="fixed inset-0 overflow-hidden bg-white">
      <Header title="送金相手を選択" backTo="/" />
      <div className="flex justify-center h-[calc(100vh-56px)] overflow-hidden">
        <div className="min-w-[300px] w-full max-w-sm p-6 flex flex-col bg-gray-50">
          <div className="space-y-4 overflow-hidden">
            <section className="bg-white rounded-xl shadow-sm p-4">
              <ul className="space-y-3">
                {users.map((user) => (
                  <li
                    key={user.user_id}
                    className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleSelect(user)}
                  >
                    {/* Icon コンポーネント */}
                    <Icon img={user.avatar_path} name={user.name} />
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddressList;