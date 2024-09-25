import React, { useState } from "react";
import { FaUpload } from "react-icons/fa";
import { RiUploadCloud2Line, RiLoader5Fill } from "react-icons/ri";

const FolderUpload = ({ onFolderUploaded }) => {
    const [folderName, setFolderName] = useState("");
    const [files, setFiles] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFilesChange = (event) => {
        const selectedFiles = Array.from(event.target.files);

        // If you want to automatically set the folder name based on the directory name:
        if (selectedFiles.length > 0) {
            const path = selectedFiles[0].webkitRelativePath || selectedFiles[0].relativePath;
            const folderNameFromPath = path.split("/")[0];
            setFolderName(folderNameFromPath);
        }

        setFiles(selectedFiles);
    };

    const handleUpload = async () => {
        if (!folderName || files.length === 0) {
            setError("Please provide a folder name and select files.");
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("folderName", folderName);

        files.forEach((file) => {
            const fileName = file.name; // Extract the file name only
            formData.append("files", file, fileName); // Use the file name when appending
        });

        const token = sessionStorage.getItem("authToken");

        try {
            const response = await fetch("http://103.145.63.232:8081/api/user/folders/upload", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                onFolderUploaded(data); // Pass the uploaded folder info back to the parent component
                alert("Folder uploaded successfully!");
            } else {
                throw new Error("Failed to upload folder.");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col w-3/4 p-10 mb-8 bg-white rounded-lg shadow-lg">
            <h2 className="flex items-center mb-4 text-2xl font-bold text-gray-800">
                <FaUpload className="mr-2"/>Upload Folder
            </h2>
            {error && <p className="mb-4 text-red-500">{error}</p>}
            <input
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Folder Name"
                className="w-full px-4 py-2 mb-4 border rounded"
            />
            <input
                type="file"
                webkitdirectory="true"
                directory="true"
                multiple
                onChange={handleFilesChange}
                className="mb-4 text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <div className="flex justify-center">
                <button
                    onClick={handleUpload}
                    disabled={loading}
                    className="flex items-center justify-center w-1/4 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                    {loading ? <RiLoader5Fill className="mr-2 size-5 animate-spin" /> : <RiUploadCloud2Line className="mr-2 size-5"/>}
                    {loading ? "Uploading..." : "Upload"}
                </button>
            </div>    
        </div>
    );
};

export default FolderUpload;
