import Button1 from '../components/button1'

function Page2() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-blue-100">
      <h1 className="text-4xl font-bold text-purple-600 mb-4">
        Page 2 画面 🚀
      </h1>
      <p className="text-gray-700 mb-6">
        Button1をクリックして遷移してきました！
      </p>
      <Button1 navigateTo="/" className="mt-6">
        Page1に戻る
      </Button1>
    </div>
  )
}

export default Page2
