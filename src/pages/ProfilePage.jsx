import React, { useState, useEffect } from "react";
import { flushSync } from "react-dom";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        address: "",
        phoneNumber: "",
    });
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(true); // Trạng thái mở/đóng của nav

    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = sessionStorage.getItem("authToken");
            try {
                const response = await fetch("/api/auth/user-details", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserDetails(data);
                    setFormData({
                        firstName: data.userProfile.firstName || "",
                        lastName: data.userProfile.lastName || "",
                        address: data.userProfile.address || "",
                        phoneNumber: data.userProfile.phoneNumber || "",
                    });
                } else {
                    throw new Error("Failed to fetch user details");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, []);

    const toggleNav = () => {
        setIsOpen(!isOpen); // Đổi trạng thái
    };
    

    const handleLogout = async () => {
        const token = sessionStorage.getItem("authToken");
        try {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                sessionStorage.removeItem("authToken");
                navigate("/login");
            } else {
                throw new Error("Failed to logout");
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleEdit = async () => {
        const token = sessionStorage.getItem("authToken");
        try {
            const response = await fetch("/api/user/profile", {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setIsEditing(false);
                setSuccessMessage(
                    <div className="flex p-2 bg-white rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg> 
                    Chỉnh sửa thành công
                </div>);
                setTimeout(() => {
                    setSuccessMessage("");
                    window.location.reload();
                }, 2000);
            } else {
                throw new Error("Failed to update profile");
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleReset = async () => {
        const token = sessionStorage.getItem("authToken");
        try {
            const response = await fetch("/api/user/profile/clear", {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                setFormData({
                    firstName: "",
                    lastName: "",
                    address: "",
                    phoneNumber: "",
                });
                setSuccessMessage("Reset thông tin thành công");
                setTimeout(() => {
                    setSuccessMessage("");
                    window.location.reload();
                }, 2000);
            } else {
                throw new Error("Failed to reset profile");
            }
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-32 h-32 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
    }

    return (
        <div className="flex flex-col w-full h-screen bg-gray-100 nor:flex-row">
            <div className="flex flex-col w-full h-screen bg-gray-100 nor:flex-row">
                <div className="relative flex flex-col w-full p-6 overflow-hidden bg-white rounded-lg shadow-lg">
                    {/* Hình ảnh nền */}
                    <div 
                        className="absolute inset-0 bg-center bg-cover opacity-20" 
                        style={{ backgroundImage: "url('/src/assets/OCR_Offline-1400x602.png')" }} 
                    ></div>

                    {/* Nội dung Profile */}
                    <div className="relative z-10 w-full">
                        <div className="relative flex items-center w-full h-auto p-4 mb-4 space-x-5 overflow-hidden duration-300 border rounded-lg bg-secondary text-gray-50 group hover:bg-sky-700">
                            <div className="absolute z-10 w-16 h-16 duration-700 bg-yellow-500 rounded-full group-hover:-top-1 group-hover:-right-2 group-hover:scale-150 right-12 top-12"></div>
                            <div className="absolute z-10 w-12 h-12 duration-700 bg-orange-500 rounded-full group-hover:-top-1 group-hover:-right-2 group-hover:scale-150 right-20 -top-6"></div>
                            <div className="absolute z-10 w-8 h-8 duration-700 bg-pink-500 rounded-full group-hover:-top-1 group-hover:-right-2 group-hover:scale-150 right-32 top-6"></div>
                            <div className="absolute z-10 w-4 h-4 duration-700 bg-red-600 rounded-full group-hover:-top-1 group-hover:-right-2 group-hover:scale-150 right-2 top-12"></div>
                            <div className="flex justify-around mb-6">
                                <div className="flex items-center justify-center w-24 h-24 text-3xl font-bold text-white rounded-full bg-primary">
                                    {userDetails.username.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="mb-6 text-start">
                                    <h1 className="text-4xl font-bold text-white">{formData.lastName.toUpperCase() + " " + formData.firstName.toUpperCase()}</h1>
                                    <p className="text-gray-200">Chi tiết về tài khoản của bạn</p>
                                </div>
                                {successMessage && (
                                    <div className="text-center text-green-500">
                                        {successMessage}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-6 align-middle nor:grid-cols-2 nor:pl-3 justify-items-center">
                        {/* Thông tin tài khoản */}
                        <div className="w-full p-6 bg-white rounded-md shadow-md">
                            <h2 className="mb-4 text-2xl font-semibold text-gray-800">Thông tin tài khoản</h2>
                            <div className="space-y-3">
                                <div className="flex items-center px-4 py-2 bg-gray-100 rounded-full shadow-sm">
                                    <i className="mr-3 fas fa-user-circle text-primary"></i>
                                    <p className="text-gray-600"><strong>Tên người dùng:</strong> {userDetails.username}</p>
                                </div>
                                <div className="flex items-center px-4 py-2 bg-gray-100 rounded-full shadow-sm">
                                    <i className="mr-3 fas fa-envelope text-primary"></i>
                                    <p className="text-gray-600"><strong>Email:</strong> {userDetails.email}</p>
                                </div>
                                <div className="flex items-center px-4 py-2 bg-gray-100 rounded-full shadow-sm">
                                    <i className="mr-3 fas fa-user-shield text-primary"></i>
                                    <p className="text-gray-600"><strong>Vai trò:</strong> {userDetails.role}</p>
                                </div>
                                <div className="flex items-center px-4 py-2 bg-gray-100 rounded-full shadow-sm">
                                    <i className="mr-3 fas fa-info-circle text-primary"></i>
                                    <p className="text-gray-600"><strong>Trạng thái:</strong> {userDetails.status}</p>
                                </div>
                                <div className="flex items-center px-4 py-2 bg-gray-100 rounded-full shadow-sm">
                                    <i className="mr-3 fas fa-calendar-alt text-primary"></i>
                                    <p className="text-gray-600"><strong>Ngày đăng ký:</strong> {new Date(userDetails.registrationDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Thông tin cá nhân */}
                        <div className="w-full p-6 bg-white rounded-md shadow-md">
                            <h2 className="mb-4 text-2xl font-semibold text-gray-800">Thông tin cá nhân</h2>
                            <div className="space-y-3">
                                {isEditing ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center px-4 py-2 bg-gray-100 rounded-full shadow-sm">
                                            <i className="mr-3 fas fa-user text-primary"></i>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                placeholder="Họ"
                                                className="w-full bg-transparent focus:outline-none"
                                            />
                                        </div>
                                        <div className="flex items-center px-4 py-2 bg-gray-100 rounded-full shadow-sm">
                                            <i className="mr-3 fas fa-user text-primary"></i>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                placeholder="Tên"
                                                className="w-full bg-transparent focus:outline-none"
                                            />
                                        </div>
                                        <div className="flex items-center px-4 py-2 bg-gray-100 rounded-full shadow-sm">
                                            <i className="mr-3 fas fa-map-marker-alt text-primary"></i>
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                placeholder="Địa chỉ"
                                                className="w-full bg-transparent focus:outline-none"
                                            />
                                        </div>
                                        <div className="flex items-center px-4 py-2 bg-gray-100 rounded-full shadow-sm">
                                            <i className="mr-3 fas fa-phone text-primary"></i>
                                            <input
                                                type="text"
                                                name="phoneNumber"
                                                value={formData.phoneNumber}
                                                onChange={handleInputChange}
                                                placeholder="Số điện thoại"
                                                className="w-full bg-transparent focus:outline-none"
                                            />
                                        </div>
                                        <div className="flex items-center justify-between px-4 py-2 shadow-sm">
                                            <button
                                                onClick={handleEdit}
                                                className="flex px-6 py-3 text-left text-white rounded-lg shadow bg-primary hover:bg-accent"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mr-2 size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                                                </svg>
                                                Lưu thay đổi
                                            </button>
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="flex px-6 py-3 text-left text-white bg-gray-500 rounded-lg shadow hover:bg-gray-700"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mr-2 size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                                                </svg>
                
                                                Hủy bỏ
                                            </button>
                                        </div>    
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center px-4 py-2 bg-gray-100 rounded-full shadow-sm">
                                            <i className="mr-3 fas fa-user text-primary"></i>
                                            <p className="text-gray-600"><strong>Họ:</strong> {userDetails.userProfile.lastName || "Chưa cập nhật"}</p>
                                        </div>
                                        <div className="flex items-center px-4 py-2 bg-gray-100 rounded-full shadow-sm">
                                            <i className="mr-3 fas fa-user text-primary"></i>
                                            <p className="text-gray-600"><strong>Tên:</strong> {userDetails.userProfile.firstName || "Chưa cập nhật"}</p>
                                        </div>
                                        <div className="flex items-center px-4 py-2 bg-gray-100 rounded-full shadow-sm">
                                            <i className="mr-3 fas fa-map-marker-alt text-primary"></i>
                                            <p className="text-gray-600"><strong>Địa chỉ:</strong> {userDetails.userProfile.address || "Chưa cập nhật"}</p>
                                        </div>
                                        <div className="flex items-center px-4 py-2 bg-gray-100 rounded-full shadow-sm">
                                            <i className="mr-3 fas fa-phone text-primary"></i>
                                            <p className="text-gray-600"><strong>Số điện thoại:</strong> {userDetails.userProfile.phoneNumber || "Chưa cập nhật"}</p>
                                        </div>
                                        <div className="flex items-center px-4 py-2 bg-gray-100 rounded-full shadow-sm">
                                            <i className="mr-3 fas fa-calendar-alt text-primary"></i>
                                            <p className="text-gray-600"><strong>Ngày tạo profile:</strong> {new Date(userDetails.userProfile.createDate).toLocaleDateString()}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>


                    </div>
                </div>
            </div>


            {/* Thanh điều hướng dọc */}
            <nav className="flex-col justify-between hidden p-4 space-y-4 bg-white shadow-lg nor:w-1/5 nor:flex nor nor:shadow-none nor:rounded-lg nor:m-4">
                <div className="flex flex-col space-y-4">
                    <button
                        onClick={() => navigate("/")}
                        className="flex px-6 py-3 text-left text-white rounded-lg shadow bg-primary hover:bg-accent"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mr-2 size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>
                        Về trang chủ
                    </button>


                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex px-6 py-3 text-left text-white rounded-lg shadow bg-primary hover:bg-accent"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mr-2 size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>

                        Chỉnh sửa thông tin
                    </button>
                    <button
                        onClick={handleReset}
                        className="flex px-6 py-3 text-left text-white bg-yellow-500 rounded-lg shadow hover:bg-yellow-700"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mr-2 size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
                        </svg>

                        Reset thông tin
                    </button>

                </div>

                <button
                    onClick={handleLogout}
                    className="flex px-6 py-3 text-left text-white bg-red-500 rounded-lg shadow hover:bg-red-700"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mr-2 size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" />
                    </svg>

                    Đăng xuất
                </button>
            </nav>

            <div className="z-10 nor:hidden">
                {/* Nút điều khiển */}
                <button
                    onClick={toggleNav}
                    className="absolute z-20 p-2 text-white rounded-full bottom-4 left-4 bg-primary"
                >
                    {isOpen ? "Close" : " Menu"}
                </button>

                {/* Thanh Nav */}
                <nav
                    className={`fixed top-0 left-0 h-full bg-white shadow-lg p-4 space-y-4 transition-transform duration-300 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                    } w-64`}
                >
                    <div className="flex flex-col space-y-4">
                        <button
                            onClick={() => navigate("/")}
                            className="flex px-6 py-3 text-left text-white rounded-lg shadow bg-primary hover:bg-accent"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mr-2 size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                            </svg>
                            Về trang chủ
                        </button>

                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex px-6 py-3 text-left text-white rounded-lg shadow bg-primary hover:bg-accent"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mr-2 size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                            Chỉnh sửa thông tin
                        </button>

                        <button
                            onClick={handleReset}
                            className="flex px-6 py-3 text-left text-white bg-yellow-500 rounded-lg shadow hover:bg-yellow-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mr-2 size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
                            </svg>
                            Reset thông tin
                        </button>
                    </div>

                    <button
                    onClick={handleLogout}
                    className="flex px-6 py-3 text-left text-white bg-red-500 rounded-lg shadow hover:bg-red-700"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mr-2 size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" />
                        </svg>
                        Đăng xuất
                    </button>
                </nav>
            </div>
        </div>
    );
};

export default ProfilePage;
