import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FileUploadExtract = () => {
    const [hovering, setHovering] = useState(false);
    const [pageNumber, setPageNumber] = useState('');
    const [message, setMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileList, setFileList] = useState([]);
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
            setSelectedFile(files[0]);
            setMessage(`Selected file: ${files[0].name}`);
        }
    };

    const handleFileExtract = async () => {
        if (!pageNumber) {
            setMessage('Please specify the page number to extract.');
            return;
        }

        const fileName = selectedFile.fileName || selectedFile.name;
        const token = sessionStorage.getItem("authToken");

        try {
            const response = await axios.post(
                `http://localhost:8081/api/pdf/extractPage?fileName=${encodeURIComponent(fileName)}&pageNumber=${pageNumber}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                setMessage('Page extracted successfully!');
                setTimeout(() => {
                    navigate('/storage');
                }, 2000);
            }
        } catch (error) {
            console.error('Error during page extraction:', error);
            setMessage('There was an error during the page extraction process.');
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
        if (!selectedFile) {
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
                disabled={!!selectedFile} // Disable file input if a file is selected
            />
            <p className="text-center text-xl font-semibold">Click to select a file or drag and drop here</p>
            <p className="mt-4 text-center">Select a <strong>PDF</strong> file to extract a page</p>

            <select
                onChange={(e) => {
                    const selectedFileName = e.target.value;
                    const file = fileList.find(f => f.fileName === selectedFileName);
                    setSelectedFile(file);
                    setMessage(''); // Clear any existing message when a file is selected
                }}
                className="mt-4 px-4 py-2 border rounded bg-white text-gray-700 focus:outline-none focus:border-blue-500"
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
                    placeholder="Page Number"
                    value={pageNumber}
                    onChange={(e) => setPageNumber(e.target.value)}
                    className="px-2 py-1 border rounded"
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
            {message && (
                <div className="mt-4 text-center text-green-600 font-semibold">
                    {message}
                </div>
            )}
            <button
                onClick={handleFileExtract}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
            >
                {selectedFile ? 'Extract Page' : 'Upload and Extract Page'}
            </button>
            <div className="mt-2 text-sm text-center">
                Supported formats:
                <span className="inline-block bg-red-500 text-white px-2 py-1 rounded ml-1 transition duration-300 hover:bg-red-600">PDF</span>
            </div>
        </div>
    );
};

export default FileUploadExtract;
