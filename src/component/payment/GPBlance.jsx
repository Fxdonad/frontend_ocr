import React, { useState, useEffect } from "react";
import { FaSyncAlt } from "react-icons/fa";

const GPBalance = () => {
    const [currentGP, setCurrentGP] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = sessionStorage.getItem("authToken");

    const fetchGPBalance = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/transactions/gpUser", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                setCurrentGP(data.currentGP);
            } else {
                throw new Error("Failed to fetch GP balance.");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch GP balance when the component mounts
        fetchGPBalance();

        // Optional: Implement auto-update logic
        const interval = setInterval(() => {
            fetchGPBalance();
        }, 60000); // Update every 60 seconds

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-gray-100 rounded-lg">
            <h1 className="flex mb-4 text-3xl font-bold text-center text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mr-3 size-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
            </svg>

                Số dư tài khoản
            </h1>

            {loading ? (
                <p className="text-center text-gray-500">Loading GP balance...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : (
                <div className="flex items-center">
                    <p className="text-2xl font-semibold text-gray-800">
                        {currentGP} GP
                    </p>
                    <button
                        onClick={fetchGPBalance}
                        className="flex px-3 py-2 ml-4 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none"
                    >
                        <span className="translate-y-1">
                            <FaSyncAlt />
                        </span> 
                        <span className="ml-2">Refresh</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default GPBalance;
