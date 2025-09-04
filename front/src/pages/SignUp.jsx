// src/pages/SignUp.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from '../components/Header';
import Button1 from '../components/button1';

export default function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [status, setStatus] = useState("");
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();

        // パスワード確認
        if (password !== confirmPassword) {
            setStatus("パスワードが一致しません");
            return;
        }

        setStatus("登録処理中...");

        // 注：バックエンドに新規登録APIがまだ実装されていないため、モック処理
        try {
            // 実際のAPIが実装されたらこのURLを変更
            const res = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name , email, password }),
            });

            // 実際はここでユーザー登録処理を行う
            // この例では単純にログイン成功とみなす
            setStatus("登録完了！ログインページへ移動します...");

            // 2秒後にログインページへ移動
            setTimeout(() => {
                navigate("/auth");
            }, 2000);
        } catch (err) {
            console.error("通信エラー:", err);
            setStatus("登録処理中にエラーが発生しました");
        }
    };

    return (
        <div className="fixed inset-0 overflow-hidden bg-white" style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
            {/* ヘッダー */}
            <Header title="新規登録" showBackButton={true} onBackClick={() => navigate('/auth')} />
            <div className="flex justify-center h-[calc(100vh-56px)] overflow-hidden">
                <div className="min-w-[300px] w-full max-w-sm p-6 flex flex-col bg-gray-50 justify-center">
                    <div className="space-y-4 overflow-hidden">
                        <form onSubmit={handleSignUp} className="space-y-4">
                            {/* 氏名フィールド */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 sr-only" htmlFor="name">
                                    氏名
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        id="name"
                                        value={name}
                                        placeholder="氏名"
                                        onChange={(e) => setName(e.target.value)}
                                        className="form-input block w-full rounded-lg border-gray-300 bg-white py-3 px-4 text-sm text-gray-900 shadow-sm transition-colors duration-200 ease-in-out focus:border-red-500 focus:ring-red-500 placeholder:text-gray-400"
                                        required
                                    />
                                </div>
                            </div>

                            {/* メールアドレスフィールド */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 sr-only" htmlFor="email">
                                    メールアドレス
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        placeholder="メールアドレス"
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="form-input block w-full rounded-lg border-gray-300 bg-white py-3 px-4 text-sm text-gray-900 shadow-sm transition-colors duration-200 ease-in-out focus:border-red-500 focus:ring-red-500 placeholder:text-gray-400"
                                        required
                                    />
                                </div>
                            </div>

                            {/* パスワードフィールド */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 sr-only" htmlFor="password">
                                    パスワード
                                </label>
                                <div className="mt-1 relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        value={password}
                                        placeholder="パスワード"
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="form-input block w-full rounded-lg border-gray-300 bg-white py-3 pr-10 pl-4 text-sm text-gray-900 shadow-sm transition-colors duration-200 ease-in-out focus:border-red-500 focus:ring-red-500 placeholder:text-gray-400"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* パスワード確認フィールド */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 sr-only" htmlFor="confirmPassword">
                                    パスワード（確認）
                                </label>
                                <div className="mt-1 relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        placeholder="パスワード（確認）"
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="form-input block w-full rounded-lg border-gray-300 bg-white py-3 pr-10 pl-4 text-sm text-gray-900 shadow-sm transition-colors duration-200 ease-in-out focus:border-red-500 focus:ring-red-500 placeholder:text-gray-400"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* 登録ボタン */}
                            <div className="mt-6">
                                <Button1
                                    type="submit"
                                    variant="danger"
                                    size="medium"
                                    className="w-full"
                                >
                                    登録する
                                </Button1>
                            </div>

                            {/* ステータスメッセージ */}
                            {status && <div className="text-center text-sm mt-2">{status}</div>}
                        </form>

                        {/* アカウントをお持ちの方向けのリンク */}
                        <div className="pb-4 text-center mt-4">
                            <p className="text-xs text-gray-500">
                                既にアカウントをお持ちですか？
                                <Link to="/auth" className="ml-1 text-xs text-gray-600 hover:text-gray-800">ログイン</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
