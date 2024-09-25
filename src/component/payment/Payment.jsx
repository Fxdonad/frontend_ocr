import React, { useState, useEffect } from "react";

const QRPayment = () => {
    const [amount, setAmount] = useState(0);
    const [qrUrl, setQrUrl] = useState("");
    const [transactionSuccess, setTransactionSuccess] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(300); // 300 seconds (5 minutes) for the countdown timer
    const bankId = "MBBank";
    const accountNo = "0346567085";
    const template = "7brqL9G";
    const accountName = "TO QUANG DUC";
    const description = "DEPOSITOCR"; // Modify this as needed

    const token = sessionStorage.getItem("authToken");

    useEffect(() => {
        if (amount > 0) {
            // Generate QR URL when amount is selected
            setQrUrl(
                `https://img.vietqr.io/image/${bankId}-${accountNo}-${template}.png?amount=${amount}&addInfo=${description}&accountName=${accountName}`
            );
            setCountdown(120); // Reset countdown timer to 2 minutes
        }
    }, [amount]);

    useEffect(() => {
        if (countdown > 0 && qrUrl && !transactionSuccess) {
            const timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (countdown === 0) {
            handleTimeout();
        }
    }, [countdown, qrUrl, transactionSuccess]);

    const checkTransactionStatus = () => {
        setLoading(true);
        fetch(
            "https://script.googleusercontent.com/macros/echo?user_content_key=aWx-8gwYrg-aD_X51n36flT8mPU87B20GPg9ckFuCytMlWa_X7rkC6rdt26AFR_TxjhuqGi_DzwH-dP7orOrhVmLyJ76PcRrm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnDfawM_bMNmlzNBBGKUk77Caw_y3EDiIqIYccBzM6IKypNfZ7dC0QCsuee0eUIkJepQ2dUz5PjeUPfLZ3VgZKw-N0E_1dFcejNz9Jw9Md8uu&lib=MiJ6PZlEM574xunmtReGn1uN-aGJIc-mt"
        )
            .then((response) => response.json())
            .then((data) => {
                const transactions = data.data;
                const matchedTransaction = transactions.find(
                    (transaction) =>
                        transaction["Giá trị"] === amount &&
                        transaction["Mô tả"].includes(description)
                );

                if (matchedTransaction) {
                    // Transaction matched, mark as success and update database
                    setTransactionSuccess(true);
                    processDeposit(amount);
                    // Tự động ẩn thông báo sau 5 giây
                    setTimeout(() => {
                        setTransactionSuccess(false);
                    }, 5000); // 5 giây
                } else {
                    // Continue checking
                    setTimeout(checkTransactionStatus, 5000); // Check every 5 seconds
                }
            })
            .catch((err) => {
                setError("Failed to check transaction status.");
                setLoading(false);
            });
    };

    const processDeposit = (depositAmount) => {
        fetch(`/api/transactions/deposit/${depositAmount}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (response.ok) {
                    console.log("Deposit processed successfully.");
                } else {
                    throw new Error("Failed to process deposit.");
                }
            })
            .catch((err) => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handlePaymentClick = () => {
        if (amount > 0) {
            setTransactionSuccess(false);
            setLoading(true);
            checkTransactionStatus();
        } else {
            alert("Please select an amount to proceed.");
        }
    };

    const handleTimeout = () => {
        setError("Quá hạn! Giao dịch đã hết hạn. Vui lòng tạo mã QR mới.");
        setQrUrl("");
        setLoading(false);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-gray-100 rounded-lg">
            <h1 className="flex mb-8 text-4xl font-bold text-center text-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mr-3 size-12">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
                </svg>
                QR Payment
            </h1>

            <div className="mb-4">
                <select
                    className="px-4 py-2 border rounded"
                    value={amount}
                    onChange={(e) => setAmount(parseInt(e.target.value))}
                >
                    <option value={0}>Select Amount</option>
                    <option value={2000}>2000 VNĐ</option>
                    <option value={3000}>3000 VNĐ</option>
                    <option value={5000}>5000 VNĐ</option>
                </select>
            </div>

            {qrUrl && (
                <div className="flex flex-col items-center justify-center mb-4">
                    <img src={qrUrl} alt="QR Code" className="w-1/2"/>
                <div className="p-3 m-3 bg-white rounded-lg">
                    <p className="m-2 text-sm font-bold text-zinc-500 ">Time left to complete payment: {formatTime(countdown)}</p>
                </div>
                </div>
            )}

            <button
                onClick={handlePaymentClick}
                className="flex px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                disabled={loading || countdown === 0}
            >
                {loading ? 
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" ma color="#000000" fill="none" className="mr-2 text-white animate-spin">
                    <path d="M18.001 20C16.3295 21.2558 14.2516 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 12.8634 21.8906 13.7011 21.6849 14.5003C21.4617 15.3673 20.5145 15.77 19.6699 15.4728C18.9519 15.2201 18.6221 14.3997 18.802 13.66C18.9314 13.1279 19 12.572 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C13.3197 19 14.554 18.6348 15.6076 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                : 
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mr-2 size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                </svg>
                }
                {loading ? " Processing..." : "Confirm Payment"}
            </button>

            {transactionSuccess && (
                <p className="flex mt-4 text-green-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mr-2 size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    Payment successful!
                </p>
            )}

            {error && 
            <p className="flex mt-4 text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mr-2 size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
                {error}
            </p>}
        </div>
    );
};

export default QRPayment;
