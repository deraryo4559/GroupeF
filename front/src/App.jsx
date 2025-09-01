function App() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">
        Tailwind 動作確認 🎉
      </h1>
      <p className="text-gray-700">
        このテキストがグレーで表示されていれば成功です！
      </p>
      <button className="mt-6 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
        テストボタン
      </button>
    </div>
  )
}

export default App
