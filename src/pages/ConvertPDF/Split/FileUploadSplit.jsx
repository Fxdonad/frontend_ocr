import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FileUploadSplit = () => {
    const [hovering, setHovering] = useState(false);
    const [startPage, setStartPage] = useState('');
    const [endPage, setEndPage] = useState('');
    const [message, setMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileList, setFileList] = useState([]); // Store list of files
    const navigate = useNavigate();

    // Fetch file list from API
    useEffect(() => {
        const fetchFileList = async () => {
            const token = sessionStorage.getItem("authToken");
            try {
                const response = await axios.get('http://localhost:8081/api/auth/user/files/list', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setFileList(response.data); // Store all files
            } catch (error) {
                console.error('Error fetching file list:', error);
                setMessage('Unable to fetch file list.');
            }
        };

        fetchFileList();
    }, []);

    const handleFileUpload = async (event) => {
        const files = event.target.files || event.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            await splitFile(file.name);
        }
    };

    const splitFile = async (fileName) => {
        const token = sessionStorage.getItem("authToken");
        try {
            let response;
            if (startPage && endPage) {
                // Split PDF by range
                response = await axios.post(
                    `http://localhost:8081/api/pdf/splitByRange?fileName=${encodeURIComponent(fileName)}&start=${startPage}&end=${endPage}`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            } else {
                // Split PDF entirely
                response = await axios.post(
                    `http://localhost:8081/api/pdf/split?fileName=${encodeURIComponent(fileName)}`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            }

            if (response.status === 200) {
                setMessage('File split successful!');
                setTimeout(() => {
                    navigate('/storage');
                }, 2000); // Redirect after 2 seconds
            }
        } catch (error) {
            console.error('Error during PDF splitting:', error);
            setMessage('There was an error during the file split process.');
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
        handleFileUpload(event);
    };

    const triggerFileUpload = (event) => {
        // Ensure that clicks on the input fields don't trigger the file upload
        if (
            event.target.tagName !== 'INPUT' ||
            (event.target.type !== 'number')
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
                onChange={handleFileUpload}
            />
            <p className="text-center text-xl font-semibold">Click to select a file or drag and drop here</p>
            <p className="mt-4 text-center">Add files <strong>PDF, Images, Word, Excel,</strong> and <strong>PowerPoint</strong></p>

            <select
                onChange={(e) => {
                    const selectedFileName = e.target.value;
                    if (selectedFileName) {
                        setSelectedFile(selectedFileName);
                        splitFile(selectedFileName);
                    }
                }}
                className="mt-4 px-4 py-2 border rounded"
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
                    className="mr-2 px-2 py-1 border rounded"
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
                <div className="mt-4 text-center text-green-600 font-semibold">
                    {message}
                </div>
            )}
            <div className="mt-2 text-sm text-center">
                Supported formats:
                <span className="inline-block bg-red-500 text-white px-2 py-1 rounded ml-1 transition duration-300 hover:bg-red-600">PDF</span>
                <span className="inline-block bg-indigo-500 text-white px-2 py-1 rounded ml-1 transition duration-300 hover:bg-indigo-600">DOC</span>
                <span className="inline-block bg-green-500 text-white px-2 py-1 rounded ml-1 transition duration-300 hover:bg-green-600">XLS</span>
                <span className="inline-block bg-yellow-500 text-white px-2 py-1 rounded ml-1 transition duration-300 hover:bg-yellow-600">PPT</span>
                <span className="inline-block bg-blue-500 text-white px-2 py-1 rounded ml-1 transition duration-300 hover:bg-blue-600">PNG</span>
                <span className="inline-block bg-red-500 text-white px-2 py-1 rounded ml-1 transition duration-300 hover:bg-red-600">JPG</span>
            </div>
        </div>
    );
};

export default FileUploadSplit;
