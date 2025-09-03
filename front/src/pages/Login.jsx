// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // ★追加
import Header from "../components/Header";  // ★追加

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();  // ★追加

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus("ログイン試行中…");
    try {
      const res = await fetch("http://localhost:5000/api/auth/mock-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        console.log("ログイン失敗:", data);
        setStatus("失敗");
        return;
      }
      setStatus("ログイン成功！");
      console.log("ログイン成功:", data.user);

      // ★ sessionStorage に認証情報を保存
      sessionStorage.setItem("authUser", JSON.stringify(data.user));

      // ★ Top.jsx に遷移
      navigate("/", { state: { user: data.user } });
    } catch (err) {
      console.error("通信エラー:", err);
      setStatus("失敗");
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-white">
      <Header title="ログイン" showBackButton={false} />
      <div className="flex justify-center h-[calc(100vh-56px)] overflow-hidden">
        <div className="min-w-[300px] w-full max-w-sm p-6 flex flex-col bg-gray-50">
          <div className="flex items-center justify-center flex-1">
            <form onSubmit={handleLogin} className="w-full max-w-sm bg-white rounded-xl shadow p-6 space-y-4">
        

        <div>
          <label className="block text-sm text-gray-600 mb-1">メールアドレス</label>
          <input
            type="email"
            value={email}
            placeholder="test1@example.com"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">パスワード</label>
          <input
            type="password"
            value={password}
            placeholder="hashed_password_1"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            ※ 今は DB の <code>password_hash</code> と完全一致で判定するモックです
          </p>
        </div>

        <button type="submit" className="w-full rounded-lg bg-blue-600 text-white py-2 font-medium hover:bg-blue-700">
          ログイン
        </button>

        {status && <div className="text-center text-sm mt-2">{status}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
