
// 仮のユーザーデータ
const users = [
  { id: 1, name: '田中 太郎' , icon: '../../public/images/human3.png'},
  { id: 2, name: '鈴木 花子' , icon: '../../public/images/human3.png'},
  { id: 3, name: '佐藤 次郎' , icon: '../../public/images/human3.png'},
  { id: 4, name: '高橋 三郎' , icon: '../../public/images/human3.png'}
];

function Step3() {
  return (
    <div className="p-6 font-sans">
      {/* タイトル */}
      <h1 className="text-3xl font-bold mb-6 text-blue-600">送金相手を選択</h1>

      {/* ユーザー一覧 */}
      <ul className="space-y-3">
        {users.map(user => (
          <li
            key={user.id}
            className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => alert(`${user.name} を選択しました`)}
          >

                        {/* アイコン */}
            <img
              src={user.icon}
              alt={user.name}
              className="w-10 h-10 rounded-full mr-4"
            />
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Step3;
