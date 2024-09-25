import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FileUploadDelete = () => {
    const [hovering, setHovering] = useState(false);
    const [startPage, setStartPage] = useState('');
    const [endPage, setEndPage] = useState('');
    const [message, setMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileList, setFileList] = useState([]); // Lưu trữ danh sách file
    const [isFileUploaded, setIsFileUploaded] = useState(false); // Track if the file has been uploaded
    const navigate = useNavigate();

    // Fetch file list từ API
    useEffect(() => {
        const fetchFileList = async () => {
            const token = sessionStorage.getItem("authToken");
            try {
                const response = await axios.get('http://103.145.63.232:8081/api/auth/user/files/list', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                // Lọc các file có đuôi .pdf
                const pdfFiles = response.data.filter(file => file.fileName.toLowerCase().endsWith('.pdf'));
                setFileList(pdfFiles);
            } catch (error) {
                console.error('Error fetching file list:', error);
                setMessage('Unable to fetch file list.');
            }
        };

        fetchFileList();
    }, []);

    const handleFileChange = (event) => {
        const files = event.target.files || event.dataTransfer.files;
        if (files.length > 0) {
            setSelectedFile(files[0]);
            setMessage(`Selected file: ${files[0].name}`);
            setIsFileUploaded(true); // Mark file as uploaded
        }
    };

    const handleFileUpload = async () => {
        const token = sessionStorage.getItem("authToken");

        if (selectedFile) {
            // Thực hiện xóa trang từ file đã upload hoặc đã chọn từ select box
            const fileName = selectedFile.fileName || selectedFile.name; // Check both scenarios
            if (startPage && endPage) {
                try {
                    const response = await axios.post(
                        `http://103.145.63.232:8081/api/pdf/deletePagesByRange?fileName=${encodeURIComponent(fileName)}&startPage=${startPage}&endPage=${endPage}`,
                        {},
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    if (response.status === 200) {
                        setMessage('Pages deleted successfully!');
                        setTimeout(() => {
                            navigate('/storage');
                        }, 2000); // Redirect after 2 seconds
                    }
                } catch (error) {
                    console.error('Error during page deletion:', error);
                    setMessage('There was an error during the page deletion process.');
                }
            } else {
                setMessage('Please specify both start page and end page.');
            }
        } else {
            setMessage('Please select or upload a file first.');
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setHovering(true);
    };

    const handleDragLeave = () => {
        setHovering(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setHovering(false);
        handleFileChange(event);
    };

    const triggerFileUpload = (event) => {
        // Prevent triggering file upload when a file is already uploaded or selected
        if (!isFileUploaded && !selectedFile) {
            document.getElementById('file-upload').click();
        }
    };

    return (
        <div
            className={`flex flex-col items-center justify-center h-screen w-screen m-auto rounded-lg shadow-lg 
                  ${hovering ? 'bg-blue-300' : 'bg-blue-100'} 
                  transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileUpload}
        >
            <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                disabled={isFileUploaded} // Disable file input after upload
            />
            <p className="text-xl font-semibold text-center">Click to select a file or drag and drop here</p>
            <p className="mt-4 text-center">Select a <strong>PDF</strong> file to delete pages</p>

            <select
                onChange={(e) => {
                    const selectedFileName = e.target.value;
                    const file = fileList.find(f => f.fileName === selectedFileName);
                    setSelectedFile(file);
                    setIsFileUploaded(true); // Đánh dấu rằng file đã được chọn
                }}
                className="px-4 py-2 mt-4 border rounded"
                onClick={(e) => e.stopPropagation()} // Prevent event propagation from triggering file upload
            >
                <option value="">-- Select a file --</option>
                {fileList.map(file => (
                    <option key={file.fileID} value={file.fileName}>
                        {file.fileName}
                    </option>
                ))}
            </select>

            <div className="mt-4">
                <input
                    type="number"
                    placeholder="Start Page"
                    value={startPage}
                    onChange={(e) => setStartPage(e.target.value)}
                    className="px-2 py-1 mr-2 border rounded"
                    onClick={(e) => e.stopPropagation()} // Prevent event propagation
                />
                <input
                    type="number"
                    placeholder="End Page"
                    value={endPage}
                    onChange={(e) => setEndPage(e.target.value)}
                    className="px-2 py-1 border rounded"
                    onClick={(e) => e.stopPropagation()} // Prevent event propagation
                />
            </div>
            {message && (
                <div className="mt-4 font-semibold text-center text-green-600">
                    {message}
                </div>
            )}
            <button
                onClick={handleFileUpload}
                className="px-4 py-2 mt-4 text-white transition duration-300 bg-blue-500 rounded hover:bg-blue-700"
            >
                {isFileUploaded ? 'Delete Pages' : 'Upload and Delete Pages'}
            </button>
            <div className="mt-2 text-sm text-center">
                Supported formats:
                <span className="inline-block px-2 py-1 ml-1 text-white transition duration-300 bg-red-500 rounded hover:bg-red-600">PDF</span>
            </div>
        </div>
    );
};

export default FileUploadDelete;
