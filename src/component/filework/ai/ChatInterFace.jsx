import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import ReactMarkdown from 'react-markdown';
import { API_KEY } from '../../../utils/config';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const ChatInterface = () => {
    const [pdfData, setPdfData] = useState(null);
    const [textContent, setTextContent] = useState('');
    const [messages, setMessages] = useState([]);
    const [userMessage, setUserMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'application/pdf') {
        const fileReader = new FileReader();

        fileReader.onload = async function () {
            const typedArray = new Uint8Array(this.result);
            const pdf = await pdfjsLib.getDocument(typedArray).promise;

            // Extract text content from PDF using pdfjs-dist
            let extractedText = '';
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            const textItems = textContent.items.map((item) => item.str).join(' ');
            extractedText += textItems + '\n\n';
            }

            setTextContent(extractedText);
            sendToGemini(extractedText); // Send extracted text to Gemini
        };

        fileReader.readAsArrayBuffer(file);
        }
    };

    const sendToGemini = async (message) => {
        setLoading(true);

        const requestData = {
        contents: [
            {
            parts: [
                {
                text: message, // Sending the message content
                },
            ],
            },
        ],
        };

        try {
        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
            {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
            }
        );

        const result = await res.json();
        const responseText =
            result?.candidates?.[0]?.content?.parts?.[0]?.text ||
            'No response received';

        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: 'ChatBot', text: responseText },
        ]);
        } catch (error) {
        console.error('Error:', error);
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: 'ChatBot', text: 'An error occurred while fetching the data.' },
        ]);
        } finally {
        setLoading(false);
        }
    };

    const handleSendMessage = () => {
        if (userMessage.trim()) {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: 'You', text: userMessage },
        ]);
        sendToGemini(userMessage);
        setUserMessage('');
        }
    };

    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
                <div className="w-full max-w-5xl p-8 mt-10 bg-white rounded-lg shadow-lg">
                    <h1 className="mb-6 text-2xl font-bold text-center text-gray-800">
                    Chat with ChatBot
                    </h1>

                    {/* PDF Upload Section */}
                    <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        Upload PDF to Start Chat
                    </label>
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="w-full p-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        multiple
                    />
                    </div>

                    {/* Chat Window */}
                    <div className="p-4 mb-4 overflow-y-auto border border-gray-300 rounded-lg shadow-lg bg-gray-50 h-96">
                    {messages.map((message, index) => (
                        <div
                        key={index}
                        className={`mb-2 p-3 rounded-lg ${
                            message.sender === 'User'
                            ? 'bg-blue-100 text-blue-800 self-end'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                        >
                        <strong>{message.sender}:</strong>
                        <ReactMarkdown>{message.text}</ReactMarkdown>
                        </div>
                    ))}
                    </div>

                    {/* Message Input */}
                    <div className="flex items-center">
                    <input
                        type="text"
                        value={userMessage}
                        onChange={(e) => setUserMessage(e.target.value)}
                        className="flex-grow p-2 mr-4 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Type your message..."
                        disabled={loading}
                    />
                    <button
                        onClick={handleSendMessage}
                        className="px-6 py-3 font-semibold text-white transition-transform duration-300 transform bg-blue-600 rounded-full shadow-lg hover:bg-blue-800"
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Send'}
                    </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChatInterface;
