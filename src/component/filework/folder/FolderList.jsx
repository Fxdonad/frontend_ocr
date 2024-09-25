import React, { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaTimes, FaCheck, FaSearch, FaFolder, FaUpload } from "react-icons/fa";
import { IoLogoElectron, IoFolderOpenSharp} from "react-icons/io5";

const FolderList = () => {
    const [folders, setFolders] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingFolderName, setEditingFolderName] = useState(null);
    const [newFolderName, setNewFolderName] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);


    const token = sessionStorage.getItem("authToken");

    useEffect(() => {
        const fetchFolders = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch("http://localhost:8081/api/user/folders/all", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setFolders(data);
                } else {
                    throw new Error("Failed to fetch folders.");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFolders();
    }, [token]);

    const handleFolderClick = (folder) => {
        setSelectedFolder(folder);
        setShowModal(true);
    };

    const handleDeleteFile = async (folderID, fileID) => {
        try {
            const response = await fetch(`http://localhost:8081/api/user/folders/${folderID}/files/${fileID}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete file.");
            }

            alert("File deleted successfully!");
            const updatedFolders = folders.map(folder =>
                folder.folderID === folderID
                    ? {
                        ...folder,
                        folderFiles: folder.folderFiles.filter(file => file.uploadedFiles.fileID !== fileID),
                    }
                    : folder
            );
            setFolders(updatedFolders);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleUpdateFile = async (folderID, fileID) => {
        if (!selectedFile) {
            alert("Please select a file to update.");
            return;
        }
    
        try {
            setIsUpdating(true); // Bắt đầu quá trình cập nhật, đặt loading thành true
            const formData = new FormData();
            formData.append("file", selectedFile);
    
            const response = await fetch(`http://localhost:8081/api/user/folders/${folderID}/files/${fileID}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
    
            if (!response.ok) {
                throw new Error("Failed to update file.");
            }
    
            const updatedFile = await response.json();
            alert("File updated successfully!");
    
            const updatedFolders = folders.map(folder =>
                folder.folderID === folderID
                    ? {
                        ...folder,
                        folderFiles: folder.folderFiles.map(file =>
                            file.uploadedFiles.fileID === fileID ? { ...file, uploadedFiles: updatedFile } : file
                        ),
                    }
                    : folder
            );
            setFolders(updatedFolders);
            setSelectedFile(null);
        } catch (err) {
            alert(err.message);
        } finally {
            setIsUpdating(false); // Hoàn thành quá trình cập nhật, đặt loading thành false
        }
    };
    
    

    const handleDeleteFolder = async (folderID) => {
        try {
            const response = await fetch(`http://localhost:8081/api/user/folders/${folderID}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete folder.");
            }

            alert("Folder deleted successfully!");
            setFolders(folders.filter(folder => folder.folderID !== folderID));
        } catch (err) {
            alert(err.message);
        }
    };

    const handleEditFolderName = (folder) => {
        setEditingFolderName(folder.folderID);
        setNewFolderName(folder.folderName);
    };

    const handleUpdateFolderName = async (folderID) => {
        try {
            const formData = new FormData();
            formData.append("folderName", newFolderName);

            const response = await fetch(`http://localhost:8081/api/user/folders/${folderID}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to update folder name.");
            }

            const updatedFolder = await response.json();
            alert("Folder name updated successfully!");

            const updatedFolders = folders.map(folder =>
                folder.folderID === folderID ? { ...folder, folderName: updatedFolder.folderName } : folder
            );

            setFolders(updatedFolders);
            setEditingFolderName(null);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUploadFile = async () => {
        if (!selectedFile) {
            alert("Please select a file to upload.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("files", selectedFile);

            const response = await fetch(`http://localhost:8081/api/user/folders/${selectedFolder.folderID}/upload`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to upload file.");
            }

            const updatedFolder = await response.json();
            alert("File uploaded successfully!");

            const updatedFolders = folders.map(folder =>
                folder.folderID === selectedFolder.folderID ? updatedFolder : folder
            );

            setFolders(updatedFolders);
            setSelectedFile(null);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedFolder(null);
        setSelectedFile(null); // Clear the selected file when closing the modal
    };

    if (loading) {
        return <div className="text-center text-gray-500">Loading folders...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    return (
        <div className="w-3/4 p-6 bg-gray-100 rounded-lg">
            <h1 className="flex items-center mb-6 text-4xl font-bold text-center text-gray-800">
                <FaFolder className="mr-2" />
                Folder Management
            </h1>

            <div className="mt-6">
                {folders.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                        {folders.map((folder) => (
                            <div
                                key={folder.folderID}
                                className="p-4 bg-white border rounded-lg shadow cursor-pointer hover:shadow-md"
                            >
                                {editingFolderName === folder.folderID ? (
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="text"
                                            value={newFolderName}
                                            onChange={(e) => setNewFolderName(e.target.value)}
                                            className="flex-grow px-2 py-1 border rounded"
                                        />
                                        <button
                                            onClick={() => handleUpdateFolderName(folder.folderID)}
                                            className="px-2 py-1 text-white bg-green-500 rounded hover:bg-green-600"
                                        >
                                            <FaCheck />
                                        </button>
                                        <button
                                            onClick={() => setEditingFolderName(null)}
                                            className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="flex items-center text-lg font-semibold text-gray-800 truncate"> <FaFolder className="mr-1" />{folder.folderName}</h2>
                                        <p className="text-sm text-gray-600">Uploaded: {new Date(folder.uploadDate).toLocaleDateString()}</p>
                                        <p className="text-sm text-gray-600">{folder.folderFiles.length} Files</p>
                                        <div className="flex mt-2 space-x-1 text-xs">
                                            <button
                                                onClick={() => handleEditFolderName(folder)}
                                                className="flex items-center px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                                            >
                                                <FaEdit className="mr-1" />
                                                Edit Name
                                            </button>
                                            <button
                                                onClick={() => handleDeleteFolder(folder.folderID)}
                                                className="flex items-center px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                                            >
                                                <FaTrash className="mr-1" />
                                                Delete Folder
                                            </button>
                                            <button
                                                onClick={() => handleFolderClick(folder)}
                                                className="flex items-center px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                                            >
                                                <FaSearch className="mr-1" />
                                                View Files
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No folders uploaded yet.</p>
                )}
            </div>

            {showModal && selectedFolder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="relative w-11/12 max-w-4xl max-h-screen p-6 overflow-y-auto bg-white rounded shadow-lg">
                        <button
                            className="absolute text-gray-600 top-4 right-4 hover:text-gray-800"
                            onClick={handleCloseModal}
                        >
                            <FaTimes size={24} />
                        </button>
                        <h2 className="mb-4 flex text-2xl font-semibold text-gray-800">
                            <IoFolderOpenSharp className="mr-2 size-7"/>
                            Files in {selectedFolder.folderName}
                        </h2>
                        <div className="flex p-8">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="w-full form-input"
                            />
                            <button
                                onClick={handleUploadFile}
                                className="flex items-center px-4 py-2 w-1/3  text-white bg-green-500 rounded hover:bg-green-600"
                            >
                                <FaUpload className="mr-2" />
                                Upload File
                            </button>
                        </div>
                        <div className="flex flex-col space-y-4 overflow-y-auto max-h-80">
                            {selectedFolder.folderFiles.map((file) => (
                                <div key={file.folderFileID} className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                                    <div>
                                        <p className="text-lg text-gray-800">{file.uploadedFiles.fileName.substring(37)}</p>
                                        <p className="text-sm text-gray-600">Type: {file.uploadedFiles.fileType}</p>
                                        <p className="text-sm text-gray-600">Size: {(file.uploadedFiles.fileSize / 1024).toFixed(2)} KB</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            className="w-full form-input"
                                        />
                                        <button
                                            onClick={() => handleUpdateFile(selectedFolder.folderID, file.uploadedFiles.fileID)}
                                            className="flex items-center px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none"
                                        >
                                            {isUpdating ? <IoLogoElectron className="mr-2 animate-spin" /> : <FaEdit className="mr-2" />}
                                            
                                            {isUpdating ? "Updating..." : "Update"}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteFile(selectedFolder.folderID, file.uploadedFiles.fileID)}
                                            className="flex items-center px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none"
                                        >
                                            <FaTrash className="mr-2" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FolderList;
