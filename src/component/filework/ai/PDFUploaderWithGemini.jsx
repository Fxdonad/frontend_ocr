import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import ReactMarkdown from 'react-markdown';
import { API_KEY } from '../../../utils/config';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PDFUploaderWithGemini = () => {
    const [pdfData, setPdfData] = useState(null);
    const [textContent, setTextContent] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [prompt, setPrompt] = useState('');

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'application/pdf') {
            const fileReader = new FileReader();

            fileReader.onload = async function () {
                const typedArray = new Uint8Array(this.result);
                const pdf = await pdfjsLib.getDocument(typedArray).promise;

                // Render PDF in original format
                setPdfData(typedArray);

                // Extract text content from PDF using pdfjs-dist
                let extractedText = '';
                for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                    const page = await pdf.getPage(pageNum);
                    const textContent = await page.getTextContent();
                    const textItems = textContent.items.map((item) => item.str).join(' ');
                    extractedText += textItems + '\n\n';
                }

                setTextContent(extractedText);
            };

            fileReader.readAsArrayBuffer(file);
        }
    };

    const handleSendToGemini = async () => {
        setLoading(true);

        const requestData = {
            contents: [
                {
                    parts: [
                        {
                            text: `${prompt}\n\n${textContent}`,  // Combine prompt and extracted text
                        }
                    ]
                }
            ]
        };

        try {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            const result = await res.json();
            const responseText = result?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received';
            setResponse(responseText);
        } catch (error) {
            console.error('Error:', error);
            setResponse('An error occurred while fetching the data.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 mb-10 bg-gray-100">
            <div className="w-full max-w-5xl p-8 bg-white rounded-lg shadow-lg">
                <h1 className="mb-6 text-2xl font-bold text-center text-gray-800">Upload PDF và Trò chuyện cùng Chatbot</h1>
                
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        Nhập yêu cầu
                    </label>
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="w-full p-2 mb-4 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Nhập yêu cầu của bạn"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        Choose a PDF file
                    </label>
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="w-full p-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        multiple
                    />
                </div>

                {pdfData && (
                    <div className="mt-6">
                        <h2 className="mb-4 text-xl font-bold text-gray-700">PDF Gốc:</h2>
                        <div className="overflow-hidden border border-gray-300 rounded-lg shadow-sm">
                            <embed
                                src={URL.createObjectURL(new Blob([pdfData], { type: 'application/pdf' }))}
                                type="application/pdf"
                                width="100%"
                                height="600px"
                                className="w-full rounded-lg"
                            />
                        </div>
                    </div>
                )}

                {textContent && (
                    <div className="mt-6">
                        <h2 className="mb-4 text-xl font-bold text-gray-700">Nội dung Text:</h2>
                        <textarea
                            className="w-full h-64 p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            value={textContent}
                            readOnly
                        />
                    </div>
                )}

                {textContent && (
                    <div className="mt-6 text-center">
                        <button
                            onClick={handleSendToGemini}
                            className="px-6 py-3 font-semibold text-white transition-transform duration-300 transform bg-blue-600 rounded-full shadow-lg hover:bg-blue-800"
                            disabled={loading}
                        >
                            {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
                        </button>
                    </div>
                )}

                {response && (
                    <div className="mt-6">
                        <h2 className="mb-4 text-xl font-bold text-gray-700">Thông tin yêu cầu:</h2>
                        <div className="p-4 border border-gray-300 rounded-lg shadow-sm bg-gray-50">
                            <ReactMarkdown>{response}</ReactMarkdown>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PDFUploaderWithGemini;
