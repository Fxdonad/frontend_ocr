import React, { useState } from 'react';
import { LuUploadCloud } from "react-icons/lu";

const FileConverter = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [base64String, setBase64String] = useState('');
    const [convertedText, setConvertedText] = useState('');
    const [pdfGenerated, setPdfGenerated] = useState(false);
    const [fileName, setFileName] = useState('');
    const [error, setError] = useState(null);
    const [loadingPDF, setLoadingPDF] = useState(false);
    const [loadingText, setLoadingText] = useState(false);
    const [loadingSavePDF, setLoadingSavePDF] = useState(false);
    const [pdfUrl, setPdfUrl] = useState('');
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [isCopiedText, setIsCopiedText] = useState(false);
    const [pdfFile, setPdfFile] = useState(null);

    // Hàm xử lý khi người dùng tải lên hình ảnh
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setSelectedImage(file);
        setError(null);
        setPdfGenerated(false);
        setPdfUrl('');
        setConvertedText('');
        setPdfFile(null);

        // Lấy tên file không có phần mở rộng
        const nameWithoutExtension = file.name.split('.').slice(0, -1).join('.');
        setFileName(nameWithoutExtension);

        // Tạo URL xem trước cho hình ảnh và chuyển đổi sang Base64
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreviewUrl(reader.result);
            const base64Data = reader.result.split(',')[1];
            setBase64String(base64Data);
        };
        reader.readAsDataURL(file);
    };
    

    // Hàm định dạng văn bản nhận được từ OCR
    const formatResponseText = (rawText) => {
        let formattedText = rawText;

        // Loại bỏ chuỗi văn bản đầu "{'hw': [], 'doc': '"
        const prefix = "{'hw': [], 'doc': '";
        const suffix = "'}";
        if (formattedText.startsWith(prefix) && formattedText.endsWith(suffix)) {
            formattedText = formattedText.substring(prefix.length, formattedText.length - suffix.length);
        }

        // Thay thế các ký tự đặc biệt nếu cần thiết
        formattedText = formattedText.replace(/\\n/g, '\n').replace(/\\t/g, ' - ');
        formattedText = formattedText.replace(/\s\s+/g, ' ');
        return formattedText;
    };

    // Hàm chuyển đổi Base64 sang PDF
    const convertBase64ToPDF = async () => {
        if (!base64String) {
            setError("Không có chuỗi Base64 để chuyển đổi.");
            return;
        }

        const token = sessionStorage.getItem("authToken");
        if (!token) {
            setError("Người dùng chưa được xác thực.");
            return;
        }

        const requestBody = {
            base64String: base64String,
            fileName: fileName
        };

        try {
            setLoadingPDF(true);
            const response = await fetch('/api/converter/base64-to-pdf', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                const blob = await response.blob();
                const pdfFile = new File([blob], `${fileName}.pdf`, { type: 'application/pdf' });
                setPdfFile(pdfFile);
                const url = URL.createObjectURL(blob);
                setPdfUrl(url);
                setPdfGenerated(true);
                setError(null);
            } else {
                throw new Error("Chuyển đổi Base64 sang PDF thất bại.");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingPDF(false);
        }
    };

    // Hàm chuyển đổi Base64 sang văn bản bằng OCR
    const convertBase64ToText = async () => {
        if (!base64String) {
            setError("Không có chuỗi Base64 để chuyển đổi.");
            return;
        }

        const token = sessionStorage.getItem("authToken");
        if (!token) {
            setError("Người dùng chưa được xác thực.");
            return;
        }

        const requestBody = {
            contentBase64: base64String
        };

        try {
            setLoadingText(true);
            const response = await fetch('/api/ocr/convertBase64ToText', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                const data = await response.json();

                if (!data.data || !data.data.json_ocr_out || data.data.json_ocr_out.trim() === "") {
                    throw new Error(data.data.info_text || "Không thể nhận dạng văn bản từ hình ảnh.");
                }

                const formattedText = formatResponseText(data.data.json_ocr_out);
                setConvertedText(formattedText);
                setError(null);
            } else {
                throw new Error("Chuyển đổi Base64 sang văn bản thất bại.");
            }
        } catch (err) {
            setError(err.message);
            setConvertedText('');
        } finally {
            setLoadingText(false);
        }
    };

    // Hàm sao chép văn bản đã chuyển đổi
    const handleCopyText = () => {
        navigator.clipboard.writeText(convertedText).then(() => {
            setIsCopiedText(true);
            setTimeout(() => setIsCopiedText(false), 2000);
        }).catch(err => {
            alert("Sao chép văn bản thất bại: ", err);
        });
    };

    // Hàm lưu PDF vào cơ sở dữ liệu
    const savePdfToDatabase = async () => {
        if (!pdfFile) {
            setError("Không có tệp PDF để lưu.");
            return;
        }

        const token = sessionStorage.getItem("authToken");
        if (!token) {
            setError("Người dùng chưa được xác thực.");
            return;
        }

        const formData = new FormData();
        formData.append('file', pdfFile);

        try {
            setLoadingSavePDF(true);
            const response = await fetch('http://localhost:8081/api/auth/user/files/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                setError(null);
                alert("PDF đã được lưu thành công vào cơ sở dữ liệu!");
            } else {
                throw new Error("Lưu PDF vào cơ sở dữ liệu thất bại.");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingSavePDF(false);
        }
    };


    return (
        <div className="flex flex-col items-center justify-center min-h-screen pt-24 pb-5 bg-gray-100">
            <h1 className="flex mb-6 text-3xl font-bold text-center md:text-4xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mr-3 md:w-10 md:h-10" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                OCR Hình Ảnh Sang Văn Bản
            </h1>

            <div className="w-full max-w-6xl p-6 bg-white rounded-lg shadow-lg">
                <div className="flex flex-col md:flex-row md:space-x-6">
                    {/* Left Column: Image Upload and Preview */}
                    <div className="flex-1">
                        {/* Upload Image */}
                        <div className="mb-6">
                            <label className="flex items-center pb-2 text-lg font-medium text-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    className="w-6 h-6 mr-2"
                                    fill="none" viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor">
                                    <path strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
                                </svg>
                                Chọn ảnh để chuyển đổi:
                            </label>
                            <div className="relative w-full mt-1">
                                {/* Input gốc được ẩn */}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                
                                {/* Giao diện tùy chỉnh */}
                                <div className="flex items-center px-4 py-2 bg-white border rounded-lg shadow cursor-pointer hover:bg-gray-50">
                                    <img
                                        alt="File Icon"
                                        className="w-8 h-8 mr-2"
                                        src="https://img.icons8.com/dusk/64/000000/file.png"
                                    />
                                    <span className="text-gray-500 text-xl">Chọn file ảnh...</span>
                                </div>
                            </div>
                        </div>

                        {/* Display Image Preview */}
                        {imagePreviewUrl && (
                            <div className="flex justify-center mb-6">
                                <img
                                    src={imagePreviewUrl}
                                    alt="Preview"
                                    className="w-1/2 h-auto max-w-md rounded-lg shadow-md"
                                />
                            </div>
                        )}

                        {/* Buttons */}
                        {base64String && (
                            <div className="flex flex-col items-center justify-center mb-6 space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                                {/* Convert to PDF Button */}
                                <button
                                    onClick={convertBase64ToPDF}
                                    disabled={loadingPDF}
                                    className="flex items-center justify-center w-full px-4 py-2 text-white transition-all duration-300 bg-green-500 rounded-lg hover:bg-green-700 md:w-auto"
                                >
                                    {loadingPDF ?
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-2 animate-spin" viewBox="0 0 24 24" fill="none">
                                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        :
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3H6.75A2.25 2.25 0 0 0 4.5 5.25v13.5A2.25 2.25 0 0 0 6.75 21h10.5A2.25 2.25 0 0 0 19.5 18.75V9h-3.75zM15 3v6h6" />
                                        </svg>
                                    }
                                    {loadingPDF ? "Đang tạo PDF..." : "Chuyển ảnh sang PDF"}
                                </button>

                                {/* Convert to Text Button */}
                                <button
                                    onClick={convertBase64ToText}
                                    disabled={loadingText}
                                    className="flex items-center justify-center w-full px-4 py-2 text-white transition-all duration-300 bg-indigo-500 rounded-lg hover:bg-indigo-700 md:w-auto"
                                >
                                    {loadingText ?
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-2 animate-spin" viewBox="0 0 24 24" fill="none">
                                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        :
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 4.5h-9A1.5 1.5 0 0 0 6 6v12a1.5 1.5 0 0 0 1.5 1.5h9A1.5 1.5 0 0 0 18 18V6a1.5 1.5 0 0 0-1.5-1.5zM9 9h6M9 12h6M9 15h3" />
                                        </svg>
                                    }
                                    {loadingText ? "Đang nhận dạng..." : "Chuyển ảnh sang Văn bản"}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Converted Text */}
                    {convertedText && (
                        <div className="flex-1 mt-8 md:mt-0">
                            <label className="flex items-center mt-10 justify-between mb-2 font-medium text-gray-700">
                                <span className="flex text-xl">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-2 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
                                    </svg>
                                    Văn bản nhận dạng:
                                </span>
                                <button
                                    onClick={handleCopyText}
                                    className={`flex items-center px-4 py-2 text-white transition-all duration-300 rounded-lg ${isCopiedText ? 'bg-green-500' : 'bg-yellow-500'} hover:bg-yellow-700`}
                                >
                                    {isCopiedText ?
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12" />
                                        </svg>
                                        :
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                                        </svg>
                                    }
                                    {isCopiedText ? "Đã sao chép!" : "Sao chép"}
                                </button>
                            </label>
                            <textarea
                                value={convertedText}
                                readOnly
                                rows={15}
                                className="w-full p-4 overflow-auto bg-gray-100 border border-gray-300 rounded-lg"
                            />
                        </div>
                    )}
                </div>

                {/* Display Error */}
                {error && (
                    <div className="p-4 mt-4 text-red-800 bg-red-100 border border-red-400 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Display PDF */}
                {pdfUrl && (
                    <div className="mt-8">
                        <label className="flex items-center justify-between mb-4 font-medium text-gray-700">
                            <h2 className="flex items-center text-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-2 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" />
                                </svg>
                                Kết quả PDF:
                            </h2>

                            <div className='flex space-x-4 '>
                                {/* Save PDF to Database */}
                                {pdfFile && (
                                    <button
                                        onClick={savePdfToDatabase}
                                        disabled={loadingSavePDF}
                                        className="flex items-center px-4 py-2 text-white transition-all duration-300 rounded-lg bg-secondary hover:bg-primary"
                                    >
                                        {loadingSavePDF ?
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-2 animate-spin" viewBox="0 0 24 24" fill="none">
                                                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            :
                                            <LuUploadCloud className="w-6 h-6 mr-2" />
                                        }
                                        {loadingSavePDF ? "Đang lưu..." : "Lưu PDF vào Cloud"}
                                    </button>
                                )}

                                {/* PDF Actions */}
                                <div className="flex flex-col items-center justify-center space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                                    <a
                                        href={pdfUrl}
                                        download={`${fileName}.pdf`}
                                        className="flex items-center justify-center w-full px-4 py-2 text-white transition-all duration-300 bg-yellow-500 rounded-lg hover:bg-yellow-700 md:w-auto"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3" />
                                        </svg>
                                        Tải PDF
                                    </a>
                                </div>
                            </div>
                        </label>

                        {/* Display PDF */}
                        <div className="w-full mt-4">
                            <iframe src={pdfUrl} title="PDF File" className="w-full h-screen border rounded"></iframe>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileConverter;
