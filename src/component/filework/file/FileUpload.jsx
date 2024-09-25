import React, { useState, useRef } from "react";

const FileUpload = () => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const allowedFileTypes = ["application/pdf", "image/jpeg", "image/png"];

    const handleDrop = (event) => {
        event.preventDefault();
        const droppedFiles = Array.from(event.dataTransfer.files);
        handleFilesUpload(droppedFiles);
    };

    const handleFilesUpload = (selectedFiles) => {
        const validFiles = selectedFiles.filter((file) => allowedFileTypes.includes(file.type));

        const newFiles = validFiles.map((file) => {
            const reader = new FileReader();
            return new Promise((resolve) => {
                reader.onload = (e) => {
                    resolve({
                        file,
                        content: e.target.result,
                    });
                };
                if (file.type.startsWith("image/")) {
                    reader.readAsDataURL(file);
                } else if (file.type === "application/pdf") {
                    reader.readAsArrayBuffer(file);
                }
            });
        });

        Promise.all(newFiles).then((filesData) => {
            setFiles((prevFiles) => [...prevFiles, ...filesData]);
        });
    };

    const handleInputChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        handleFilesUpload(selectedFiles);
    };

    const handleDropZoneClick = () => {
        fileInputRef.current.click();
    };

    const handleFileUpload = async () => {
        const token = sessionStorage.getItem("authToken");

        if (!token) {
            setError("User is not authenticated.");
            return;
        }

        if (files.length === 0) {
            setError("No files to upload.");
            return;
        }

        const formData = new FormData();
        files.forEach((fileData) => {
            formData.append("file", fileData.file);
        });

        setUploading(true);
        setError(null);
        setUploadSuccess(null);

        try {
            const response = await fetch("http://103.145.63.232:8081/api/auth/user/files/upload", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                setUploadSuccess("Files uploaded successfully!");
                setFiles([]);
            } else {
                throw new Error("Failed to upload files");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 mt-10 mb-10 bg-gray-100">
            <h1 className="mb-8 text-4xl font-bold text-center text-gray-800">
                Upload Files
            </h1>

            {/* Drop Zone */}
            <div
                className="flex items-center justify-center w-full max-w-4xl p-8 mb-6 text-center transition-colors duration-300 bg-white border-4 border-dashed rounded-lg cursor-pointer hover:border-primary"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={handleDropZoneClick}
            >
                <img
                    alt="File Icon"
                    className="mb-3"
                    src="https://img.icons8.com/dusk/64/000000/file.png"
                />
                <p className="text-lg text-gray-500">
                    Drag and drop your files here or click to select
                </p>
            </div>

            {/* Input File */}
            <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                className="hidden"
                ref={fileInputRef}
                onChange={handleInputChange}
            />

            {/* Display Section */}
            <div className="w-full max-w-4xl p-6 mb-4 bg-white border rounded-lg shadow-lg">
                {files.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {files.map((fileData, index) => (
                            <div key={index} className="mb-4">
                                {fileData.file.type.startsWith("image/") ? (
                                    <img
                                        src={fileData.content}
                                        alt={`Uploaded ${index}`}
                                        className="w-full h-auto mb-2 rounded-md"
                                    />
                                ) : (
                                    <div className="p-4 text-sm text-gray-900 whitespace-pre-wrap border rounded-lg bg-gray-50">
                                        {fileData.file.name}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No files selected</p>
                )}
            </div>

            {/* Upload Button */}
            <button
                onClick={handleFileUpload}
                disabled={uploading}
                className={`px-6 py-3 text-white rounded-lg shadow ${
                    uploading ? "bg-gray-500" : "bg-primary hover:bg-accent"
                }`}
            >
                {uploading ? "Uploading..." : "Upload Files"}
            </button>

            {/* Error/Success Messages */}
            {error && <p className="mt-4 text-red-500">{error} You must log in before using this feature.</p>}
            {uploadSuccess && <p className="mt-4 text-green-500">{uploadSuccess}</p>}
        </div>
    );
};

export default FileUpload;
