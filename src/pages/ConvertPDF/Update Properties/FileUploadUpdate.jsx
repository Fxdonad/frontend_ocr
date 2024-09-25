import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FileUploadUpdate = () => {
    const [hovering, setHovering] = useState(false);
    const [message, setMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [subject, setSubject] = useState('');
    const [keywords, setKeywords] = useState('');
    const [fileList, setFileList] = useState([]);
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const [buttonText, setButtonText] = useState('Upload and Update Properties');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFileList = async () => {
            const token = sessionStorage.getItem("authToken");
            try {
                const response = await axios.get('http://localhost:8081/api/auth/user/files/list', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
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
            setButtonText('Upload and Update Properties');
            setMessage(`Selected file: ${files[0].name}`);
        }
    };

    const handleFileUpload = async () => {
        if (!selectedFile) {
            setMessage('Please select a file first.');
            return;
        }

        const fileName = selectedFile.fileName || selectedFile.name; // Handle file from select box or upload
        const token = sessionStorage.getItem("authToken");

        try {
            if (!isFileUploaded) {
                // If the file is not uploaded, we assume it's a new file
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
                setIsFileUploaded(true);
                setButtonText('Update Properties'); // Change button text after upload
            }

            // Update properties of the file
            const response = await axios.post(
                `http://localhost:8081/api/pdf/updateProperties?fileName=${encodeURIComponent(fileName)}&title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}&subject=${encodeURIComponent(subject)}&keywords=${encodeURIComponent(keywords)}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                setMessage('PDF properties updated successfully!');
                setTimeout(() => {
                    navigate('/storage');
                }, 2000);
            }
        } catch (error) {
            console.error('Error during PDF property update:', error);
            setMessage(`There was an error updating the PDF properties: ${error.response?.data?.message || error.message}`);
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
            (event.target.tagName !== 'INPUT' ||
                (event.target.type !== 'text' && event.target.type !== 'number' && event.target.tagName !== 'SELECT'))
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
            <p className="mt-4 text-center">Select a <strong>PDF</strong> file to update its properties</p>

            <select
                onChange={(e) => {
                    const selectedFileName = e.target.value;
                    const file = fileList.find(f => f.fileName === selectedFileName);
                    setSelectedFile(file);
                    setIsFileUploaded(true); // Consider it already uploaded if selected from the list
                    setButtonText('Update Properties'); // Change button text to "Update Properties"
                    setMessage(`Selected file: ${file.fileName}`);
                }}
                className="mt-4 px-4 py-2 border rounded bg-white text-gray-700 focus:outline-none focus:border-blue-500 hover:bg-gray-100"
                onClick={(e) => e.stopPropagation()}
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
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mb-2 px-2 py-1 border rounded w-full"
                    onClick={(e) => e.stopPropagation()}
                />
                <input
                    type="text"
                    placeholder="Author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="mb-2 px-2 py-1 border rounded w-full"
                    onClick={(e) => e.stopPropagation()}
                />
                <input
                    type="text"
                    placeholder="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="mb-2 px-2 py-1 border rounded w-full"
                    onClick={(e) => e.stopPropagation()}
                />
                <input
                    type="text"
                    placeholder="Keywords"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="mb-2 px-2 py-1 border rounded w-full"
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
            {message && (
                <div className="mt-4 text-center text-green-600 font-semibold">
                    {message}
                </div>
            )}
            <button
                onClick={handleFileUpload}
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

export default FileUploadUpdate;
