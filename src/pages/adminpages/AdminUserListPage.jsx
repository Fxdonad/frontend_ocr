import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUserAlt, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Header from "../../layout/Header";

const AdminUserListPage = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    const usersPerPage = 4;

    useEffect(() => {
        fetchAllUsers();
    }, []);

    useEffect(() => {
        handleSearch();
    }, [searchQuery, users]);

    const fetchAllUsers = async () => {
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
            const data = response.data.map((user) => ({
            userID: user.userID,
            username: user.username,
            email: user.email,
            status: user.status,
            }));
            setUsers(data);
            setFilteredUsers(data);
            setLoading(false);
        } else {
            throw new Error(`Failed to load users: ${response.status}`);
        }
        } catch (error) {
        setError(error.message);
        setLoading(false);
        }
    };

    const handleSearch = () => {
        const filtered = users.filter((user) =>
        user.userID.toString().includes(searchQuery) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredUsers(filtered);
        setCurrentPage(1); // Reset to the first page on search
    };

    const handleUserClick = (userID) => {
        navigate(`/admin/user/${userID}`);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    if (loading) {
        return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-32 h-32 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
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

    if (filteredUsers.length === 0) {
        return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-lg text-gray-500">No users available.</p>
        </div>
        );
    }

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    return (
        <div>
        <Header />
        <div className="min-h-screen p-6 pt-20 bg-gray-100">
            <h1 className="mb-6 text-3xl font-bold text-gray-800">Danh sách người dùng</h1>
            <div className="flex items-center justify-center mb-6">
                <FaSearch className="w-6 h-6 mr-2 text-gray-500" />
                <input
                type="text"
                placeholder="Search by ID, username, or email"
                className="p-2 border border-gray-300 rounded-lg min-w-64 focus:outline-none focus:ring focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            
            <ul className="space-y-4">
            {currentUsers.map((user, index) => (
                <li
                key={user.userID}
                className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md cursor-pointer hover:bg-gray-50"
                onClick={() => handleUserClick(user.userID)}
                >
                <div className="flex items-center">
                    <FaUserAlt className="w-6 h-6 mr-4 text-blue-500" />
                    <div>
                    <h2 className="text-lg font-semibold text-gray-700">
                        {`ID: ${user.userID} - ${user.username}`}
                    </h2>
                    <p className="text-gray-500">{`Status: ${user.status}`}</p>
                    </div>
                </div>
                <span className="text-sm text-gray-400">{`User #${index + 1 + (currentPage - 1) * usersPerPage}`}</span>
                </li>
            ))}
            </ul>

            <div className="flex justify-center mt-6">
            {Array.from({ length: totalPages }, (_, index) => (
                <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 mx-1 border rounded ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-white text-gray-700"}`}
                >
                {index + 1}
                </button>
            ))}
            </div>
        </div>
        </div>
    );
};

export default AdminUserListPage;
