import React, { useEffect, useState } from "react";
import { FaTimes, FaEdit, FaDownload, FaFile } from "react-icons/fa";

const FileViewer = ({ file, onClose }) => {
    const [fileContent, setFileContent] = useState(null);
    const [error, setError] = useState(null);
    const [newFile, setNewFile] = useState(null);
    const token = sessionStorage.getItem("authToken");

    useEffect(() => {
        const fetchFileContent = async () => {
            try {
                let response;

                if (file.fileType === "PDF") {
                    response = await fetch(`/api/auth/converter/download-pdf?fileName=${file.fileName.replace(/\.[^/.]+$/, "")}`, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                } else if (file.fileType === "JPG" || file.fileType === "PNG") {
                    response = await fetch(`/api/auth/converter/download-image?imageName=${file.fileName.replace(/\.[^/.]+$/, "")}&format=${file.fileType.toLowerCase()}`, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                }

                if (response.ok) {
                    const blob = await response.blob();
                    const objectURL = URL.createObjectURL(blob);
                    setFileContent(objectURL);
                } else {
                    throw new Error("Failed to load file content");
                }
            } catch (err) {
                setError(err.message);
            }
        };

        fetchFileContent();
    }, [file, token]);

    const handleFileChange = (event) => {
        setNewFile(event.target.files[0]);
    };

    const handleFileUpdate = async () => {
        if (!newFile) {
            setError("Please select a new file to upload.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("file", newFile);

            const response = await fetch(`/api/auth/user/files/${file.fileID}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                const updatedFile = await response.json();
                setFileContent(URL.createObjectURL(newFile)); // Update the file content in the viewer
                alert("File updated successfully!");
                setError(null);
            } else {
                throw new Error("Failed to update the file.");
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="relative w-full max-w-3xl p-6 bg-white rounded-lg shadow-xl transition-transform transform-gpu hover:scale-[1.02] hover:shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 p-2 text-gray-600 hover:text-gray-800"
                >
                    <FaTimes size={20} />
                </button>
                <h2 className="mb-4 flex text-2xl font-semibold text-gray-800"><FaFile className="mr-2 size-8"/>{file.document.documentName}</h2>
                {error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <div className="overflow-hidden rounded-lg">
                        {fileContent ? (
                            file.fileType === "PDF" ? (
                                <iframe
                                    src={fileContent}
                                    title={file.fileName}
                                    className="w-full h-96 rounded-lg"
                                ></iframe>
                            ) : (
                                <img
                                    src={fileContent}
                                    alt={file.fileName}
                                    className="w-full h-auto max-h-[60vh] object-contain rounded-lg"
                                />
                            )
                        ) : (
                            <p className="text-gray-500">Loading file...</p>
                        )}
                        <div className="flex items-center justify-between mt-4">
                            <a
                                href={fileContent}
                                download={file.fileName}
                                className="items-center flex px-6 py-3 mt-4 text-white bg-primary rounded-full hover:bg-accent"
                            >
                                <FaDownload className="mr-2" />
                                Download File
                            </a>
                            {/* Edit File Section */}
                            <div className="flex mt-6 items-center">
                                <button
                                    onClick={handleFileUpdate}
                                    className="flex items-center px-4 py-2 mt-4 text-white bg-blue-500 rounded-full hover:bg-blue-600"
                                >
                                    <FaEdit className="mr-2" />
                                    Update File
                                </button>
                                <div className="items-center space-x-4">
                                    <label className="ml-4 block text-sm font-medium text-gray-700">
                                        Select a new file to replace the current one:
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*,application/pdf"
                                        onChange={handleFileChange}
                                        className="mt-2"
                                    />
                                </div>    
                            </div>
                        </div>    
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileViewer;
