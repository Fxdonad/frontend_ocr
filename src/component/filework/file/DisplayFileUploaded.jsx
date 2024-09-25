import React, { useState, useEffect } from "react";
import FileViewer from "./FileViewer";
import { FaTrash, FaSearch } from "react-icons/fa";

const DisplayFileUploaded = () => {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const token = sessionStorage.getItem("authToken");
    const recordsPerPage = 6; 

    const filteredFiles = files.filter((file) =>
        file.document.documentName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentFiles = filteredFiles.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredFiles.length / recordsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };
    
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    
    useEffect(() => {
        const fetchUploadedFiles = async () => {
            if (!token) {
                setError("User is not authenticated.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch("/api/auth/user/files/list", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setFiles(data);
                } else {
                    throw new Error("Failed to fetch files");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUploadedFiles();
        setCurrentPage(1);
    }, [token]);

    const handleViewFile = (file) => {
        setSelectedFile(file);
    };

    const handleCloseViewer = () => {
        setSelectedFile(null);
    };

    const handleDeleteFile = async (fileID) => {
        try {
            const response = await fetch(`/api/auth/user/files/${fileID}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete file.");
            }

            setFiles(files.filter((file) => file.fileID !== fileID));
            setSelectedFile(null);
        } catch (err) {
            setError("Failed to delete file.");
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
        return <div className="text-center text-red-500">{error}</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center p-6 mt-10 bg-gray-100">
            <h1 className="flex mb-8 text-4xl font-bold text-center text-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mr-3 size-12">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                </svg>
                Kho lưu trữ tài liệu
            </h1>

            <div className="flex justify-center w-full mb-6">
                <input
                    type="text"
                    placeholder="Search by file name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 mb-4 border rounded w-full max-w-xs"
                />
                <FaSearch className="size-10 ml-3" />
            </div>    

            <div className="w-full max-w-6xl p-6 bg-white border rounded-lg shadow-lg">
                {filteredFiles.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                        {currentFiles.map((file) => (
                            <div
                                key={file.fileID}
                                className="p-4 transition duration-300 border rounded-lg shadow bg-gray-50 hover:shadow-md"
                            >
                                <h2 className="flex text-lg font-semibold text-gray-800 truncate">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mr-1 size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                </svg>
                                    {file.document.documentName}
                                </h2>
                                <p className="text-sm text-gray-600">Type: {file.fileType}</p>
                                <p className="text-sm text-gray-600">
                                    Size: {(file.fileSize / 1024).toFixed(2)} KB
                                </p>
                                <p className="text-sm text-gray-600">
                                    Uploaded: {new Date(file.uploadDate).toLocaleDateString()}
                                </p>
                                <p
                                    className={`text-sm ${
                                        file.processed ? "text-green-500" : "text-red-500"
                                    }`}
                                >
                                    Status: {file.processed ? "Processed" : "Not Processed"}
                                </p>
                                {file.processed && (
                                    <p className="text-sm text-gray-600">
                                        Processed Date:{" "}
                                        {new Date(file.processedDate).toLocaleDateString()}
                                    </p>
                                )}
                                <div className="flex flex-col justify-between mt-4 nor:flex-row">
                                    <button
                                        onClick={() => handleViewFile(file)}
                                        className="flex items-center px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none"
                                    >
                                        <FaSearch className="mr-2" />
                                        View File
                                    </button>
                                    <button
                                        onClick={() => handleDeleteFile(file.fileID)}
                                        className="flex items-center px-6 py-2 mt-4 text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none"
                                    >
                                        <FaTrash className="mr-2" />
                                        Delete File
                                    </button>
                                </div>    
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No files uploaded yet.</p>
                )}
            </div>
            <div className="flex items-center space-x-4 justify-between mt-4">
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    Previous
                </button>
                <p className="text-gray-600">Page {currentPage} of {totalPages}</p>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    Next
                </button>
            </div>

            {selectedFile && (
                <FileViewer file={selectedFile} onClose={handleCloseViewer} onDelete={handleDeleteFile} />
            )}
        </div>
    );
};

export default DisplayFileUploaded;
