import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaSave, FaArrowLeft, FaEnvelope, FaCoins, FaHdd } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";

const ViewUserDetail = () => {
    const { userID } = useParams();
    const navigate = useNavigate();

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [email, setEmail] = useState("");
    const [currentGP, setCurrentGP] = useState("");
    const [maxStorage, setMaxStorage] = useState("");

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const fetchUserDetails = async () => {
        try {
            const token = sessionStorage.getItem("authToken");
            if (!token) {
                throw new Error("No token found");
            }

            const response = await axios.get(`http://103.145.63.232:8081/api/admin/users/${userID}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                const data = response.data;
                setUserData(data);
                setEmail(data.email);
                setCurrentGP(data.currentGP.toString());
                setMaxStorage((data.maxStorage / (1024 * 1024)).toFixed(2)); // Convert to MB
                setLoading(false);
            } else {
                throw new Error(`Failed to load user details: ${response.status}`);
            }
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const handleUpdateUser = async () => {
        try {
            const token = sessionStorage.getItem("authToken");
            if (!token) {
                throw new Error("No token found");
            }

            const response = await axios.put(
                `http://103.145.63.232:8081/api/admin/users/${userID}`,
                {
                    email,
                    currentGP: parseInt(currentGP, 10),
                    maxStorage: parseFloat(maxStorage) * 1024 * 1024, // Convert MB back to bytes
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                alert("User updated successfully");
                navigate('/admin/users'); // Navigate back to user list after updating
            } else {
                throw new Error(`Failed to update user: ${response.status}`);
            }
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <AiOutlineLoading3Quarters className="w-16 h-16 text-blue-500 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg text-red-500">{`Error: ${error}`}</p>
            </div>
        );
    }

    return (
        <div className="">
            <Header />
            <div className="p-6 pt-20 overflow-hidden bg-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Thông tin chi tiết</h1>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/users')}
                        className="flex items-center justify-center px-4 py-2 text-white bg-gray-500 rounded-full shadow-lg hover:bg-gray-600"
                    >
                        <FaArrowLeft className="w-6 h-6 mr-2" />
                        Back
                    </button>
                </div>
                <form className="space-y-6 md:flex md:space-x-6">
                    <div className="w-full mt-6">
                        <EditableSection
                            email={email}
                            setEmail={setEmail}
                            currentGP={currentGP}
                            setCurrentGP={setCurrentGP}
                            maxStorage={maxStorage}
                            setMaxStorage={setMaxStorage}
                        />
                        <div className="flex justify-end mt-6">
                            <button
                                type="button"
                                onClick={handleUpdateUser}
                                className="flex items-center justify-center px-6 py-3 text-white bg-teal-500 rounded-full shadow-lg hover:bg-teal-600"
                            >
                                <FaSave className="w-6 h-6 mr-2" />
                                Save Changes
                            </button>
                        </div>
                    </div>
                    <div className="w-full">
                        <NonEditableSection user={userData} />
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
};

const EditableSection = ({ email, setEmail, currentGP, setCurrentGP, maxStorage, setMaxStorage }) => {
    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-xl font-semibold text-teal-600">Thông tin có thể thay đổi</h2>
            <EditableField
                label="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                icon={<FaEnvelope className="w-5 h-5 text-gray-500" />}
            />
            <EditableField
                label="Current GP"
                value={currentGP}
                onChange={e => setCurrentGP(e.target.value)}
                type="number"
                icon={<FaCoins className="w-5 h-5 text-yellow-500" />}
            />
            <EditableField
                label="Max Storage (MB)"
                value={maxStorage}
                onChange={e => setMaxStorage(e.target.value)}
                type="number"
                icon={<FaHdd className="w-5 h-5 text-purple-500" />}
            />
        </div>
    );
};

const EditableField = ({ label, value, onChange, type = "text", icon }) => {
    return (
        <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-700">{label}</label>
            <div className="flex items-center border border-gray-300 rounded-lg">
                <div className="p-2">{icon}</div>
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    className="w-full p-2 border-l border-gray-300 rounded-r-lg focus:outline-none"
                />
            </div>
        </div>
    );
};

const NonEditableSection = ({ user }) => {
    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-xl font-semibold text-teal-600">Thông tin người dùng</h2>
            <DetailCard title="Username" content={user.username} />
            <DetailCard title="Profile ID" content={user.userProfile.profileID.toString()} />
            <DetailCard title="Role" content={user.role} />
            <DetailCard title="Registration Date" content={user.registrationDate || 'N/A'} />
            <DetailCard title="Phone Number" content={user.userProfile.phoneNumber || 'N/A'} />
            <DetailCard title="Address" content={user.userProfile.address || 'N/A'} />
            <DetailCard title="Last Login Date" content={user.lastLoginDate || 'N/A'} />
            <DetailCard title="Status" content={user.status || 'N/A'} />
        </div>
    );
};

const DetailCard = ({ title, content }) => {
    return (
        <div className="p-4 mb-4 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <p className="text-gray-600">{content}</p>
        </div>
    );
};

export default ViewUserDetail;
