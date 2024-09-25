import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FileUploadMerge = () => {
    const [hovering, setHovering] = useState(false);
    const [message, setMessage] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [fileList, setFileList] = useState([]);
    const [buttonText, setButtonText] = useState('Upload Files and Merge Files');
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
        const files = Array.from(event.target.files || event.dataTransfer.files);
        const newFiles = files.filter(
            (file) => !selectedFiles.some((selectedFile) => selectedFile.name === file.name)
        );

        if (newFiles.length > 0) {
            setSelectedFiles([...selectedFiles, ...newFiles]);
            setMessage(`Selected files: ${[...selectedFiles, ...newFiles].map(file => file.name).join(', ')}`);
            setButtonText('Merge Files');
        } else {
            setMessage('Some files were already selected.');
        }
    };

    const handleFileUploadOrMerge = async () => {
        if (selectedFiles.length === 0) {
            setMessage('Please select files to merge.');
            return;
        }

        const fileNames = selectedFiles.map(file => file.name || file.fileName).join(', ');
        const outputFileName = 'MergedPDF.pdf';
        const token = sessionStorage.getItem("authToken");

        try {
            const uploadedFileNames = fileList.map(file => file.fileName);
            const filesToUpload = selectedFiles.filter(file => !uploadedFileNames.includes(file.name));

            if (filesToUpload.length > 0) {
                const formData = new FormData();
                filesToUpload.forEach(file => formData.append('files', file));

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
            }

            // Merge files
            const response = await axios.post(
                `http://103.145.63.232:8081/api/pdf/merge?fileNames=${encodeURIComponent(fileNames)}&outputFileName=${encodeURIComponent(outputFileName)}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                setMessage('Files merged successfully!');
                setTimeout(() => {
                    navigate('/storage');
                }, 2000);
            }
        } catch (error) {
            console.error('Error during file merging:', error);
            setMessage(`There was an error during the file merging process: ${error.response?.data?.message || error.message}`);
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
        if (selectedFiles.length === 0) {
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
                multiple
                onChange={handleFileChange}
            />
            <p className="text-xl font-semibold text-center">Click to select files or drag and drop here</p>
            <p className="mt-4 text-center">Select <strong>PDF</strong> files to merge</p>

            <select
                multiple
                onChange={(e) => {
                    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
                    const files = selectedOptions.map(selectedFileName =>
                        fileList.find(f => f.fileName === selectedFileName)
                    );
                    setSelectedFiles(files);
                    setMessage(`Selected files: ${files.map(file => file.fileName).join(', ')}`);
                    setButtonText('Merge Files');
                }}
                className="px-4 py-2 mt-4 text-gray-700 bg-white border rounded focus:outline-none focus:border-blue-500 hover:bg-gray-100"
                onClick={(e) => e.stopPropagation()} // Prevent event propagation from triggering file upload
            >
                {fileList.map(file => (
                    <option key={file.fileID} value={file.fileName}>
                        {file.fileName}
                    </option>
                ))}
            </select>

            {message && (
                <div className="mt-4 font-semibold text-center text-green-600">
                    {message}
                </div>
            )}
            <button
                onClick={handleFileUploadOrMerge}
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

export default FileUploadMerge;
