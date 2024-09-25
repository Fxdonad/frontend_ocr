import React, { useState } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Img from "../assets/QuickScan.png";

const Register = () => {
    // State để quản lý các giá trị của form
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Kiểm tra mật khẩu và xác nhận mật khẩu có khớp nhau không
        if (password !== confirmPassword) {
            setErrorMessage("Mật khẩu và xác nhận mật khẩu không khớp");
            return;
        }
    
        // Tạo payload để gửi đến API
        const payload = {
            username: username,
            passwordHash: password,
            email: email,
        };
    
        try {
            const response = await fetch("http://103.145.63.232:8081/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
    
            if (response.ok) {
                // Xử lý thành công
                const data = await response.json();
                setSuccessMessage("Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.");
                setErrorMessage(""); // Xóa thông báo lỗi nếu có
                // Reset form
                setUsername("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
            } else if (response.status === 409) {
                // Xử lý lỗi 409 (Conflict)
                const errorData = await response.json();
                setErrorMessage(errorData.message || "Tài khoản đã tồn tại.");
                setSuccessMessage(""); // Xóa thông báo thành công nếu có
            } else {
                // Xử lý các lỗi khác từ phản hồi của API
                const errorData = await response.json();
                setErrorMessage(errorData.message || "Có lỗi xảy ra. Vui lòng thử lại.");
                setSuccessMessage(""); // Xóa thông báo thành công nếu có
            }
        } catch (error) {
            // Xử lý lỗi mạng hoặc lỗi khác
            setErrorMessage("Tên tài khoản đã tồn tại hoặc lỗi Server");
            setSuccessMessage(""); // Xóa thông báo thành công nếu có
        }
    };
    

    return (
        <div className="flex flex-col min-h-screen sm:flex-row">
            {/* Left Side: Registration Form */}
            <div className="flex items-center justify-center w-full p-6 bg-gray-100 sm:w-1/2">
                <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-xl">
                    <h2 className="mb-6 text-3xl font-extrabold text-center text-gray-900">
                        Tạo tài khoản mới
                    </h2>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Các trường nhập liệu */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Tên đăng nhập
                            </label>
                            <div className="mt-1">
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Mật khẩu
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                                Xác nhận mật khẩu
                            </label>
                            <div className="mt-1">
                                <input
                                    id="confirm-password"
                                    name="confirm-password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                />
                            </div>
                        </div>
                        {errorMessage && (
                            <div className="text-sm text-red-500">{errorMessage}</div>
                        )}
                        {successMessage && (
                            <div className="text-sm text-green-500">{successMessage}</div>
                        )}
                        <div>
                            <button
                                type="submit"
                                className="flex justify-center w-full px-4 py-2 font-medium text-white transition-all duration-300 border border-transparent rounded-lg shadow-sm bg-primary hover:bg-accent"
                            >
                                Đăng ký
                            </button>
                        </div>
                        <div className="text-sm text-center text-gray-600">
                            Đã có tài khoản?{" "}
                            <a href="/login" className="font-medium text-primary hover:text-accent">
                                Đăng nhập ngay
                            </a>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right Side: Image with Information */}
            <div className="relative hidden w-full bg-center bg-cover sm:flex sm:w-1/2" style={{ backgroundImage: `url(${Img})` }}>
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 text-white">
                    <h2 className="mb-4 text-4xl font-extrabold">Tham gia dịch vụ OCR của chúng tôi</h2>
                    <p className="mb-8 text-lg text-center">
                        Trải nghiệm chuyển đổi tài liệu nhanh chóng và hiệu quả ngay hôm nay!
                    </p>
                    <a
                        href="/"
                        className="inline-block px-6 py-3 mt-4 font-semibold transition-transform duration-300 transform bg-white rounded-full shadow-lg text-primary hover:translate-x-1 hover:bg-accent hover:text-white"
                    >
                        Back to Home
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Register;
