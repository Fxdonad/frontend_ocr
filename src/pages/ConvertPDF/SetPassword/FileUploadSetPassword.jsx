import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FileUploadSetPassword = () => {
    const [hovering, setHovering] = useState(false);
    const [message, setMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [password, setPassword] = useState('');
    const [fileList, setFileList] = useState([]);
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const [buttonText, setButtonText] = useState('Upload and Set Password');
    const navigate = useNavigate();

    // Fetch the file list from the API
    useEffect(() => {
        const fetchFileList = async () => {
            const token = sessionStorage.getItem("authToken");
            try {
                const response = await axios.get('http://103.145.63.232:8081/api/auth/user/files/list', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                // Filter to include only PDF files
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
            setIsFileUploaded(false);
            setButtonText('Upload and Set Password');
            setMessage(`Selected file: ${files[0].name}`);
        }
    };

    const handleFileUpload = async () => {
        if (!selectedFile) {
            setMessage('Please select a file first.');
            return;
        }

        if (!password) {
            setMessage('Please enter a password.');
            return;
        }

        const fileName = selectedFile.fileName || selectedFile.name;
        const token = sessionStorage.getItem("authToken");

        try {
            if (!isFileUploaded) {
                // If the file is not uploaded, we assume it's a new file
                const formData = new FormData();
                formData.append('file', selectedFile);

                await axios.post(
                    'http://103.145.63.232:8081/api/auth/user/files/upload',
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
                setIsFileUploaded(true);
                setButtonText('Set Password'); // Change button text after upload
            }

            // Set password for the PDF
            const response = await axios.post(
                `http://103.145.63.232:8081/api/pdf/setPassword?fileName=${encodeURIComponent(fileName)}&password=${encodeURIComponent(password)}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                setMessage('Password set successfully for the PDF!');
                setTimeout(() => {
                    navigate('/storage');
                }, 2000);
            }
        } catch (error) {
            console.error('Error during setting password:', error);
            setMessage(`There was an error during the password setting process: ${error.response?.data?.message || error.message}`);
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
        if (
            !isFileUploaded &&
            event.target.tagName !== 'INPUT' &&
            event.target.tagName !== 'SELECT'
        ) {
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
            />
            <p className="text-xl font-semibold text-center">Click to select a file or drag and drop here</p>
            <p className="mt-4 text-center">Select a <strong>PDF</strong> file to set a password</p>

            <select
                onChange={(e) => {
                    const selectedFileName = e.target.value;
                    const file = fileList.find(f => f.fileName === selectedFileName);
                    setSelectedFile(file);
                    setIsFileUploaded(true); // Consider it already uploaded if selected from the list
                    setButtonText('Set Password'); // Change button text to "Set Password"
                    setMessage(`Selected file: ${file.fileName}`);
                }}
                className="px-4 py-2 mt-4 text-gray-700 bg-white border rounded focus:outline-none focus:border-blue-500 hover:bg-gray-100"
                onClick={(e) => e.stopPropagation()} // Prevent triggering file upload when clicking on select box
            >
                <option value="">-- Select a file --</option>
                {fileList.map(file => (
                    <option key={file.fileID} value={file.fileName}>
                        {file.fileName}
                    </option>
                ))}
            </select>

            <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-1/5 px-2 py-1 mt-4 border rounded"
                onClick={(e) => e.stopPropagation()} // Prevent event propagation
            />
            {message && (
                <div className="mt-4 font-semibold text-center text-green-600">
                    {message}
                </div>
            )}
            <button
                onClick={handleFileUpload}
                className="px-4 py-2 mt-4 text-white transition duration-300 bg-blue-500 rounded hover:bg-blue-700"
            >
                {buttonText}
            </button>
            <div className="mt-2 text-sm text-center">
                Supported formats:
                <span className="inline-block px-2 py-1 ml-1 text-white transition duration-300 bg-red-500 rounded hover:bg-red-600">PDF</span>
            </div>
        </div>
    );
};

export default FileUploadSetPassword;
