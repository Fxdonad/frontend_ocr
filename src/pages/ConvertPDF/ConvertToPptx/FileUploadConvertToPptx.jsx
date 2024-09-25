import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FileUploadConvertToPptx = () => {
    const [hovering, setHovering] = useState(false);
    const [message, setMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileList, setFileList] = useState([]); // Store the list of files
    const [buttonText, setButtonText] = useState('Upload and Convert to PPTX'); // Button text state
    const [isFileExisting, setIsFileExisting] = useState(false); // Track if the file already exists
    const navigate = useNavigate();

    // Fetch the file list from the API
    useEffect(() => {
        const fetchFileList = async () => {
            const token = sessionStorage.getItem("authToken");
            try {
                const response = await axios.get('http://localhost:8081/api/auth/user/files/list', {
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
            const file = files[0];
            const existingFile = fileList.find(f => f.fileName === file.name);

            if (existingFile) {
                // If the file already exists, set it as the selected file and skip uploading
                setSelectedFile(existingFile);
                setIsFileExisting(true);
                setButtonText('Convert to PPTX');
                setMessage(`File already exists: ${file.name}. You can convert it to a PPTX.`);
            } else {
                setSelectedFile(file);
                setIsFileExisting(false);
                setButtonText('Upload and Convert to PPTX');
                setMessage(`Selected file: ${file.name}`);
            }
        }
    };

    const handleFileUploadOrConvertToPptx = async () => {
        if (!selectedFile) {
            setMessage('Please select a file first.');
            return;
        }

        const fileName = selectedFile.fileName || selectedFile.name; // Handle file from select box or upload
        const token = sessionStorage.getItem("authToken");

        try {
            if (!isFileExisting) {
                // If the file is new and not already uploaded
                const formData = new FormData();
                formData.append('file', selectedFile);

                await axios.post(
                    'http://localhost:8081/api/auth/user/files/upload',
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );

                setMessage('File uploaded successfully! Now converting to PPTX...');
            }

            // Convert PDF to PPTX
            const response = await axios.post(
                `http://localhost:8081/api/pdf/convertToPptx?fileName=${encodeURIComponent(fileName)}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                setMessage('PDF converted to PPTX successfully!');
                setTimeout(() => {
                    navigate('/storage');
                }, 2000); // Redirect after 2 seconds
            }
        } catch (error) {
            console.error('Error during PDF conversion:', error);
            setMessage(`There was an error converting the PDF to PPTX: ${error.response?.data?.message || error.message}`);
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
        // Only trigger file upload if no file is selected or the selected file is not an existing file
        if (
            !isFileExisting &&
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
            <p className="text-center text-xl font-semibold">Click to select a file or drag and drop here</p>
            <p className="mt-4 text-center">Select a <strong>PDF</strong> file to convert to PPTX</p>

            <select
                onChange={(e) => {
                    const selectedFileName = e.target.value;
                    const file = fileList.find(f => f.fileName === selectedFileName);
                    setSelectedFile(file);
                    setIsFileExisting(true); // Mark as existing file
                    setButtonText('Convert to PPTX'); // Change button text to "Convert to PPTX"
                    setMessage(`Selected file: ${file.fileName}`);
                }}
                className="mt-4 px-4 py-2 border rounded bg-white text-gray-700 focus:outline-none focus:border-blue-500 hover:bg-gray-100"
                onClick={(e) => e.stopPropagation()} // Prevent event propagation from triggering file upload
            >
                <option value="">-- Select a file --</option>
                {fileList.map(file => (
                    <option key={file.fileID} value={file.fileName}>
                        {file.fileName}
                    </option>
                ))}
            </select>

            {message && (
                <div className="mt-4 text-center text-green-600 font-semibold">
                    {message}
                </div>
            )}
            <button
                onClick={handleFileUploadOrConvertToPptx}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
            >
                {buttonText}
            </button>
            <div className="mt-2 text-sm text-center">
                Supported formats:
                <span className="inline-block bg-red-500 text-white px-2 py-1 rounded ml-1 transition duration-300 hover:bg-red-600">PDF</span>
            </div>
        </div>
    );
};

export default FileUploadConvertToPptx;
