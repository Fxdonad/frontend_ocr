import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import { FaUsers, FaFileAlt, FaCoins, FaHdd } from "react-icons/fa";

const AdminManage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalFilesUploaded, setTotalFilesUploaded] = useState(0);
    const [totalGP, setTotalGP] = useState(0);
    const [totalUserStorage, setTotalUserStorage] = useState(0);

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        try {
        const token = sessionStorage.getItem("authToken");
        if (!token) {
            throw new Error("No token found");
        }

        const response = await axios.get("http://103.145.63.232:8081/api/admin/users", {
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            const data = response.data;

            const totalUsersCount = data.length;
            const totalFilesUploadedCount = data.reduce((sum, user) => sum + (user.documents?.length || 0), 0);
            const totalGPCount = data.reduce((sum, user) => sum + (user.currentGP || 0), 0);
            const totalUserStorageCount = data.reduce((sum, user) => sum + (user.maxStorage || 0), 0);

            setTotalUsers(totalUsersCount);
            setTotalFilesUploaded(totalFilesUploadedCount);
            setTotalGP(totalGPCount);
            setTotalUserStorage(totalUserStorageCount / (1024 * 1024)); // Convert to MB
        } else {
            throw new Error(`Failed to load statistics: ${response.status}`);
        }
        } catch (error) {
        console.error("Error fetching statistics:", error);
        }
    };

    return (
        <>
            <Header />
            <div className="min-h-screen p-6 pt-20 bg-gray-100">
                <h1 className="mb-6 text-3xl font-bold text-gray-800">Quản lý thông tin</h1>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <StatisticCard 
                    icon={<FaUsers className="w-8 h-8 text-blue-500" />} 
                    title="Total Users" 
                    value={totalUsers} 
                    />
                    <StatisticCard 
                    icon={<FaFileAlt className="w-8 h-8 text-green-500" />} 
                    title="Total Files Uploaded" 
                    value={totalFilesUploaded} 
                    />
                    <StatisticCard 
                    icon={<FaCoins className="w-8 h-8 text-yellow-500" />} 
                    title="Total Users GP" 
                    value={totalGP} 
                    />
                    <StatisticCard 
                    icon={<FaHdd className="w-8 h-8 text-purple-500" />} 
                    title="Total User Storage" 
                    value={`${totalUserStorage.toFixed(2)} MB`} 
                    />
                </div>
            </div>
            <Footer />
        </>
    );
    };

    const StatisticCard = ({ icon, title, value }) => {
    return (
        <div className="flex items-center p-6 bg-white rounded-lg shadow-md">
        <div className="mr-4">
            {icon}
        </div>
        <div>
            <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        </div>
    );
};

export default AdminManage;
