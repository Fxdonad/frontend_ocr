import React, { useState, useEffect } from "react";
import { FaSync, FaArrowUp, FaBox, FaServer, FaCoins, FaHdd, FaServicestack } from "react-icons/fa";
import PricingTable from "./PricingTable";

const ServiceInfo = () => {
    const [requestInfo, setRequestInfo] = useState(null);
    const [gpInfo, setGpInfo] = useState(null);
    const [storageInfo, setStorageInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [upgradeAmount, setUpgradeAmount] = useState(10);

    const token = sessionStorage.getItem("authToken");

    const fetchRequestInfo = async () => {
        try {
            const response = await fetch("http://103.145.63.232:8081/api/transactions/request-info", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                setRequestInfo(data);
            } else {
                throw new Error("Failed to fetch request info.");
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchGpInfo = async () => {
        try {
            const response = await fetch("http://103.145.63.232:8081/api/transactions/gpUser", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                setGpInfo(data);
            } else {
                throw new Error("Failed to fetch GP info.");
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchStorageInfo = async () => {
        try {
            const response = await fetch("http://103.145.63.232:8081/api/transactions/storage-info", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                setStorageInfo(data);
            } else {
                throw new Error("Failed to fetch storage info.");
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleUpgradeRequests = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://103.145.63.232:8081/api/transactions/upgrade-requests/${upgradeAmount}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                alert("Requests upgraded successfully!");
                // Fetch updated data
                fetchRequestInfo();
                fetchGpInfo();
            } else {
                throw new Error("Failed to upgrade requests.");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpgradeStorage = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://103.145.63.232:8081/api/transactions/upgrade-storage/${upgradeAmount}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                alert("Storage upgraded successfully!");
                // Fetch updated data
                fetchStorageInfo();
                fetchGpInfo();
            } else {
                throw new Error("Failed to upgrade storage.");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequestInfo();
        fetchGpInfo();
        fetchStorageInfo();
    }, []);

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    return (
        <div className="p-8 bg-white rounded-md shadow-md">
            <h1 className="flex justify-center mb-6 text-4xl font-semibold text-gray-700">
                <FaServicestack className="mr-3"/>
                Quản lý dịch vụ
            </h1>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* GP Info */}
                <div className="flex items-center p-4 mb-6 rounded-md shadow-sm bg-gray-50 space-x-9">
                    <div className="flex items-center">
                        <FaCoins className="w-16 h-16 mr-3 text-gray-400" />
                        <div>
                            <h2 className="text-lg font-medium text-gray-600">GP khả dụng</h2>
                            {gpInfo ? (
                                <p className="text-xl font-bold text-gray-800">{gpInfo.currentGP} GP</p>
                            ) : (
                                <p className="text-gray-500">Loading...</p>
                            )}
                        </div>
                    </div>
                    <PricingTable />
                </div>
                
                {/* Request Info */}
                <div className="flex items-center p-4 mb-6 rounded-md shadow-sm bg-gray-50">
                    <FaServer className="mr-3 text-gray-400 w-36 h-36" />
                    <div className="flex-grow">
                        <h2 className="text-lg font-medium text-gray-600">Request Info</h2>
                        {requestInfo ? (
                            <div className="text-gray-700">
                                <p className="p-3 m-1 rounded-md bg-zinc-200">Total Requests: <span className="font-semibold">{requestInfo.totalRequests}</span></p>
                                <p className="p-3 m-1 rounded-md bg-zinc-200">Remaining Requests: <span className="font-semibold">{requestInfo.remainingRequests}</span></p>
                                <p className="p-3 m-1 rounded-md bg-zinc-200">Used Requests: <span className="font-semibold">{requestInfo.usedRequests}</span></p>
                                <p className="p-3 m-1 rounded-md bg-zinc-200">Upgraded Requests: <span className="font-semibold">{requestInfo.upgradedRequests}</span></p>
                            </div>
                        ) : (
                            <p className="text-gray-500">Loading...</p>
                        )}
                    </div>
                    <div className="items-center ml-4">
                        <span className="ml-4 text-xl font-bold">Chọn mức nâng cấp:</span>
                        <div className="flex items-center mt-1 ml-4">
                            <select
                                className="p-2 bg-gray-100 border rounded-md focus:outline-none"
                                value={upgradeAmount}
                                onChange={(e) => setUpgradeAmount(parseInt(e.target.value))}
                            >
                                <option value={10}>10 GP</option>
                                <option value={20}>20 GP</option>
                                <option value={30}>30 GP</option>
                            </select>
                            <button
                                onClick={handleUpgradeRequests}
                                disabled={loading}
                                className="relative h-10 ml-2 text-xl font-semibold text-center text-black bg-white shadow-lg w-36 rounded-2xl group"
                            >
                                <div
                                    className="bg-green-400 rounded-xl h-8 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[135px] z-10 duration-500"
                                >
                                <FaArrowUp />
                                </div>
                                <p className="translate-x-2">Update</p>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Storage Info */}
                <div className="flex items-center p-4 mb-6 rounded-md shadow-sm bg-gray-50">
                <FaHdd className="mr-3 text-gray-400 w-36 h-36" />
                    <div className="flex-grow">
                        <h2 className="text-lg font-medium text-gray-600">Storage Info</h2>
                        {storageInfo ? (
                            <div className="text-gray-700">
                                <p className="p-3 m-1 rounded-md bg-zinc-200">Used Storage: <span className="font-semibold">{(storageInfo.usedStorage / (1024 * 1024)).toFixed(2)} MB</span></p>
                                <p className="p-3 m-1 rounded-md bg-zinc-200">Available Storage: <span className="font-semibold">{(storageInfo.availableStorage / (1024 * 1024)).toFixed(2)} MB</span></p>
                                <p className="p-3 m-1 rounded-md bg-zinc-200">Upgraded Storage: <span className="font-semibold">{(storageInfo.upgradedStorage / (1024 * 1024)).toFixed(2)} MB</span></p>
                            </div>
                        ) : (
                            <p className="text-gray-500">Loading...</p>
                        )}
                    </div>
                    <div className="items-center ml-4">
                        <span className="ml-4 text-xl font-bold">Chọn mức nâng cấp:</span>
                        <div className="flex items-center mt-1 ml-4">
                            <select
                                className="p-2 bg-gray-100 border rounded-md focus:outline-none"
                                value={upgradeAmount}
                                onChange={(e) => setUpgradeAmount(parseInt(e.target.value))}
                            >
                                <option value={10}>10 GP</option>
                                <option value={20}>20 GP</option>
                                <option value={30}>30 GP</option>
                            </select>
                            <button
                                onClick={handleUpgradeStorage}
                                disabled={loading}
                                className="relative h-10 ml-2 text-xl font-semibold text-center text-black bg-white shadow-lg w-36 rounded-2xl group"
                            >
                                <div
                                    className="bg-primary rounded-xl h-8 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[135px] z-10 duration-500"
                                >
                                <FaArrowUp className="text-white" />
                                </div>
                                <p className="translate-x-2">Update</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>    
        </div>
    );
};

export default ServiceInfo;
