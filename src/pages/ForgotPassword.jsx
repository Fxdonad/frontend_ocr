import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Img from '../assets/QuickScan.png';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleForgotPassword = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`http://localhost:8081/api/auth/forgot-password?email=${email}`);
            if (response.status === 200) {
                setMessage('Mật khẩu tạm thời đã được gửi đến email của bạn.');
                setTimeout(() => {
                    navigate('/login'); // Chuyển hướng đến trang đăng nhập sau 2 giây
                }, 2000);
            }
        } catch (error) {
            setMessage('Có lỗi xảy ra. Vui lòng thử lại.');
            console.error('Error during forgot password:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGoBack = () => {
        navigate('/'); // Quay lại trang chủ
    };

    return (
        <div className="flex flex-col min-h-screen md:flex-row">
            {/* Phần Trái: Hình ảnh minh họa */}
            <div
                className="relative hidden w-full bg-center bg-cover md:flex md:w-1/2"
                style={{ backgroundImage: `url(${Img})` }}
            >
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 text-white">
                    <h2 className="mb-4 text-4xl font-extrabold">Khôi phục mật khẩu</h2>
                    <p className="mb-8 text-lg text-center">
                        Nhập email của bạn để nhận mật khẩu tạm thời và truy cập lại tài khoản.
                    </p>
                    <button
                        onClick={handleGoBack}
                        className="inline-block px-6 py-3 mt-4 font-semibold transition-transform duration-300 transform bg-white rounded-full shadow-lg text-primary hover:translate-x-1 hover:bg-accent hover:text-white"
                    >
                        Quay lại trang chủ
                    </button>
                </div>
            </div>

            {/* Phần Phải: Form Quên Mật Khẩu */}
            <div className="flex items-center justify-center w-full p-6 bg-gray-100 md:w-1/2">
                <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-xl">
                    <h2 className="mb-6 text-3xl font-extrabold text-center text-gray-900">
                        Quên mật khẩu
                    </h2>
                    <p className="mb-4 text-center text-gray-600">
                        Nhập địa chỉ email của bạn và chúng tôi sẽ gửi mật khẩu tạm thời.
                    </p>
                    {message && (
                        <div className="p-4 mb-4 text-center text-white bg-blue-500 rounded-lg">
                            {message}
                        </div>
                    )}
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Địa chỉ Email
                            </label>
                            <div className="mt-1">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleForgotPassword}
                            disabled={loading}
                            className="flex items-center justify-center w-full px-4 py-2 font-medium text-white transition-all duration-300 rounded-lg bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            {loading && (
                                <svg
                                    className="w-5 h-5 mr-2 text-white animate-spin"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8H4z"
                                    ></path>
                                </svg>
                            )}
                            {loading ? 'Đang xử lý...' : 'Gửi mật khẩu tạm thời'}
                        </button>
                        <div className="text-sm text-center text-gray-600">
                            Nhớ mật khẩu?{' '}
                            <a href="/login" className="font-medium text-primary hover:text-accent">
                                Đăng nhập ngay
                            </a>
                        </div>
                        <button
                            onClick={handleGoBack}
                            className="flex items-center justify-center w-full px-4 py-2 mt-4 font-medium text-white transition-all duration-300 bg-gray-500 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                            Quay lại trang chủ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
