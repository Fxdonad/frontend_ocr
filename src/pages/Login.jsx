import React, { useState } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate } from "react-router-dom";

const Login = () => {
    // State để quản lý các giá trị của form
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    // Hàm xử lý submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Tạo payload để gửi đến API
        const payload = {
            username: username,
            passwordHash: password,
        };

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                // Xử lý thành công
                const token = await response.text(); // Lấy token từ phản hồi
                sessionStorage.setItem("authToken", token); // Lưu token vào sessionStorage
                setErrorMessage(""); // Xóa thông báo lỗi nếu có
                navigate("/"); // Chuyển hướng đến trang chủ
            } else {
                // Xử lý lỗi từ phản hồi của API
                setErrorMessage("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
            }
        } catch (error) {
            // Xử lý lỗi mạng hoặc lỗi khác
            setErrorMessage("Không thể kết nối tới server. Vui lòng kiểm tra kết nối mạng.");
        }
    };

    return (
        <div className="flex flex-col min-h-screen md:flex-row">
            {/* Left Side: Image with Information */}
            <div
                className="relative hidden w-full bg-center bg-cover md:w-1/2 md:block"
                style={{ backgroundImage: "url('/src/assets/QuickScan.png')" }}
            >
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 text-white">
                    <h2 className="mb-4 text-4xl font-extrabold">Chào mừng đến với Dịch vụ OCR</h2>
                    <p className="mb-8 text-lg text-center">
                        Giúp bạn chuyển đổi tài liệu nhanh chóng và dễ dàng với các công cụ tiên tiến.
                    </p>
                    <a
                        href="/"
                        className="inline-block px-6 py-3 mt-4 font-semibold transition-transform duration-300 transform bg-white rounded-full shadow-lg text-primary hover:translate-x-1 hover:bg-accent hover:text-white"
                    >
                        Back to Home
                    </a>
                </div>
            </div>
            
            {/* Right Side: Login Form */}
            <div className="flex items-center justify-center w-full p-6 bg-gray-100 md:w-1/2">
                <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-xl">
                    <h2 className="mb-6 text-3xl font-extrabold text-center text-gray-900">
                        Đăng nhập vào tài khoản của bạn
                    </h2>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Form fields */}
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
                        {errorMessage && (
                            <div className="text-sm text-red-500">{errorMessage}</div>
                        )}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="w-4 h-4 border-gray-300 rounded text-primary focus:ring-primary"
                                />
                                <label htmlFor="remember-me" className="block ml-2 text-sm text-gray-900">
                                    Ghi nhớ đăng nhập
                                </label>
                            </div>
                            <div className="text-sm">
                                <a href="/forgot-password" className="font-medium text-primary hover:text-accent">
                                    Quên mật khẩu?
                                </a>
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="flex justify-center w-full px-4 py-2 font-medium text-white transition-all duration-300 border border-transparent rounded-lg shadow-sm bg-primary hover:bg-accent"
                            >
                                Đăng nhập
                            </button>
                        </div>
                        <div className="text-sm text-center text-gray-600">
                            Chưa có tài khoản?{" "}
                            <a href="/register" className="font-medium text-primary hover:text-accent">
                                Đăng ký ngay
                            </a>
                        </div>
                    </form>
                    <div className="flex justify-center mt-6 space-x-4">
                        <button className="px-4 py-2 text-white transition-all duration-300 bg-red-600 rounded-lg shadow-sm hover:bg-red-700">
                            <i className="fab fa-google"></i>
                        </button>
                        <button className="px-4 py-2 text-white transition-all duration-300 bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700">
                            <i className="fab fa-twitter"></i>
                        </button>
                        <button className="px-4 py-2 text-white transition-all duration-300 bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700">
                            <i className="fab fa-linkedin-in"></i>
                        </button>
                    </div>
                    <a
                        href="/"
                        className="inline-block px-6 py-3 mt-4 font-semibold transition-transform duration-300 transform bg-white rounded-full shadow-lg text-primary hover:translate-x-1 hover:bg-accent hover:text-white md:hidden"
                    >
                        Back to Home
                    </a>
                </div>
            </div>

        </div>
    );
};

export default Login;
