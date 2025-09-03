import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Button1 from "../components/button1";
import Balance from "../components/Balance";
import Icon from "../components/Icon";

function PaymentRequest() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [paymentRequest, setPaymentRequest] = useState(null);
    const [currentBalance, setCurrentBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);

    // ログイン中のユーザーID取得 (セッションストレージから取得)
    const getCurrentUserId = () => {
        const saved = sessionStorage.getItem("authUser");
        const user = saved ? JSON.parse(saved) : null;
        return user?.user_id ?? 52; // なければデフォルト52を使用
    };

    const currentUserId = getCurrentUserId();

    // 請求データと残高を取得
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            let requestDataFetched = false;

            try {
                // 請求情報を取得
                const requestRes = await fetch(`http://localhost:5000/api/requests/${token}`);

                if (!requestRes.ok) {
                    throw new Error(`請求情報の取得に失敗しました (ステータス: ${requestRes.status})`);
                }

                const requestData = await requestRes.json();

                if (!requestData.ok) {
                    throw new Error(`請求情報が見つかりません: ${requestData.message || "不明なエラー"}`);
                }

                // 請求情報の取得成功
                setPaymentRequest(requestData.request);
                requestDataFetched = true;

                try {
                    // 残高を取得（請求情報とは別にtry-catchで囲む）
                    const balanceRes = await fetch(`http://localhost:5000/api/accounts/${currentUserId}`);

                    if (!balanceRes.ok) {
                        throw new Error(`残高情報の取得に失敗しました (ステータス: ${balanceRes.status})`);
                    }

                    const balanceData = await balanceRes.json();

                    // バックエンドの実装によってレスポンス形式が異なる可能性に対応
                    if (balanceData.ok === false || balanceData.error) {
                        throw new Error(balanceData.message || balanceData.error || "残高情報の取得に失敗しました");
                    }

                    // balanceDataの構造に応じて残高を取得
                    const balance = balanceData.balance || balanceData.account?.balance || 0;
                    setCurrentBalance(balance);
                } catch (balanceErr) {
                    console.error("残高取得エラー:", balanceErr);
                    alert(`残高情報の取得に失敗しました: ${balanceErr.message}\n残高ゼロとして処理します。`);
                    setCurrentBalance(0);
                }
            } catch (err) {
                console.error("請求情報取得エラー:", err);
                // 請求情報取得に失敗した場合はエラーを表示
                setError(`請求リンクが無効です: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token, currentUserId]);

    // 支払い処理
    const handlePayment = async () => {
        if (processing || !paymentRequest) return;

        // 残高チェック
        if (currentBalance < paymentRequest.amount) {
            alert("残高が不足しています");
            return;
        }

        setProcessing(true);

        try {
            const res = await fetch(`http://localhost:5000/api/requests/${token}/pay`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    paid_by_id: currentUserId
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.ok) {
                throw new Error(data.message || "支払い処理に失敗しました");
            }

            // 支払い完了画面へ遷移
            navigate("/payment/complete", {
                state: {
                    previousBalance: currentBalance,
                    newBalance: data.new_balance,
                    amount: paymentRequest.amount
                }
            });
        } catch (err) {
            console.error("支払いエラー:", err);
            alert(err.message || "支払い処理中にエラーが発生しました");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <>
                <Header title="読み込み中" backTo="/" />
                <div className="min-h-screen pt-20 px-4 pb-8 bg-gray-50 flex items-center justify-center">
                    <div className="text-center">読み込み中...</div>
                </div>
            </>
        );
    }

    if (error || !paymentRequest) {
        return (
            <>
                <Header title="エラー" backTo="/" />
                <div className="min-h-screen pt-20 px-4 pb-8 bg-gray-50 flex items-center justify-center">
                    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-sm p-6">
                        <div className="flex flex-col items-center">
                            {/* エラーアイコン */}
                            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-4">
                                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-800 mb-4">請求情報が見つかりません</h2>
                            <div className="text-center text-red-600 mb-6">{error || "無効な請求リンクです"}</div>
                            <button
                                onClick={() => navigate("/")}
                                className="w-full py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium transition-colors"
                            >
                                トップページに戻る
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header title="支払い" backTo="/" />
            <div className="min-h-screen pt-20 px-4 pb-8 bg-gray-50">
                <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-center text-gray-800 mb-6">
                        支払いリクエスト
                    </h2>

                    {/* 請求元ユーザー表示 */}
                    <div className="mb-6">
                        <Icon
                            img={paymentRequest.requester_avatar || "/images/human1.png"}
                            name={paymentRequest.requester_name || "ユーザー"}
                        />
                    </div>

                    {/* 残高表示 */}
                    <div className="relative">
                        <Balance balance={currentBalance} label="現在の残高" highlight />
                        {currentBalance === 0 && (
                            <div className="absolute right-0 top-0 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded">
                                残高情報の取得に失敗した可能性があります
                            </div>
                        )}
                    </div>

                    {/* メッセージ表示 */}
                    {paymentRequest.message && (
                        <div className="mt-6">
                            <div className="text-sm text-gray-600 leading-6 mb-2">
                                メッセージ
                            </div>
                            <textarea
                                rows={3}
                                value={paymentRequest.message}
                                readOnly
                                className="w-full pl-4 pr-4 py-3 text-[15px] md:text-base rounded-xl border border-gray-300 bg-white placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none"
                            />
                        </div>
                    )}

                    {/* 支払額表示 */}
                    <Balance balance={paymentRequest.amount} label="支払額" />

                    {/* ステータス表示 (すでに支払い済みの場合) */}
                    {paymentRequest.status === 'success' ? (
                        <div className="mt-6 p-3 bg-gray-100 rounded-lg text-center">
                            <p className="text-gray-700">この請求はすでに支払い済みです</p>
                        </div>
                    ) : (
                        <div className="mt-6 flex justify-center">
                            <Button1
                                onClick={handlePayment}
                                disabled={processing || currentBalance < paymentRequest.amount}
                            >
                                {processing ? '処理中...' : (currentBalance < paymentRequest.amount ? '残高不足' : '支払う')}
                            </Button1>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default PaymentRequest;
