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

    // デバッグ用ログ
    console.log("認証ユーザー情報:", me);
    console.log("除外するユーザーID:", myId);

    fetch(`http://localhost:5000/api/users?exclude_id=${myId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('データの取得に失敗しました');
        }
        return response.json();
      })
      .then(data => {
        console.log("取得したユーザーリスト:", data); // デバッグ用
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
    // 修正点1: h-scree -> h-screen に修正
    <div className="flex flex-col h-screen">
      <Header title="送金相手を選択" backTo="/" />
      {/* スクロール可能なコンテンツエリア */}
      <div className="flex-grow overflow-y-auto">
        <div className="flex justify-center">
          <div className="min-w-[300px] w-full max-w-sm pl-6 pr-6 flex flex-col bg-gray-50">
            <ul className="divide-y divide-gray-200 my-4 rounded-xl shadow-sm overflow-hidden bg-white">
              {users.map((user) => (
                <li
                  key={user.user_id}
                  className="hover:bg-red-50 transition-colors cursor-pointer py-3"
                  onClick={() => handleSelect(user)}
                >
                  <Icon img={user.avatar_path} name={user.name} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddressList;