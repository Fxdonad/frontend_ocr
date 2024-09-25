import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import { FaTrashAlt, FaUndo, FaRedo } from 'react-icons/fa';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PDFEditor = () => {
    const [pdf, setPdf] = useState(null);
    const [pages, setPages] = useState([]);
    const [rotations, setRotations] = useState({});

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'application/pdf') {
        const fileReader = new FileReader();

        fileReader.onload = async function () {
            const typedArray = new Uint8Array(this.result);
            const pdfDocument = await pdfjsLib.getDocument(typedArray).promise;
            setPdf(pdfDocument);

            const pdfPages = [];
            for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
            const page = await pdfDocument.getPage(pageNum);
            const viewport = page.getViewport({ scale: 1.5 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({ canvasContext: context, viewport }).promise;

            pdfPages.push({ num: pageNum, canvas });
            }

            setPages(pdfPages);
            setRotations({});
        };

        fileReader.readAsArrayBuffer(file);
        }
    };

    const rotatePage = (pageNum, direction) => {
        setRotations((prevRotations) => {
        const newRotations = { ...prevRotations };
        if (!newRotations[pageNum]) {
            newRotations[pageNum] = 0;
        }
        newRotations[pageNum] += direction === 'left' ? -90 : 90;
        return newRotations;
        });
    };

    const deletePage = (pageNum) => {
        setPages((prevPages) => prevPages.filter((page) => page.num !== pageNum));
    };

    return (
        <div className="flex flex-col items-center justify-center mt-10 p-6 bg-gray-100">
        <div className="w-full max-w-5xl p-8 bg-white rounded-lg shadow-lg">
            <h1 className="mb-6 text-2xl font-bold text-center text-gray-800">
            PDF Editor
            </h1>
            <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
                Upload a PDF to Edit
            </label>
            <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="w-full p-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            </div>

            <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-3">
            {pages.map((page, index) => (
                <div key={index} className="relative p-4 bg-gray-50 rounded-lg shadow-md">
                <div className="flex justify-between mb-2">
                    <button
                    onClick={() => rotatePage(page.num, 'left')}
                    className="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-700"
                    >
                    <FaUndo />
                    </button>
                    <button
                    onClick={() => rotatePage(page.num, 'right')}
                    className="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-700"
                    >
                    <FaRedo />
                    </button>
                    <button
                    onClick={() => deletePage(page.num)}
                    className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-700"
                    >
                    <FaTrashAlt />
                    </button>
                </div>
                <div
                    style={{
                    transform: `rotate(${rotations[page.num] || 0}deg)`,
                    transition: 'transform 0.3s ease-in-out',
                    }}
                >
                    <img
                    src={page.canvas.toDataURL()}
                    alt={`Page ${page.num}`}
                    className="w-full h-auto rounded"
                    />
                </div>
                </div>
            ))}
            </div>

            {pages.length > 0 && (
            <div className="mt-6 text-center">
                <button className="px-6 py-3 font-semibold text-white transition-transform duration-300 transform bg-green-600 rounded-full shadow-lg hover:bg-green-800">
                Save Changes
                </button>
            </div>
            )}
        </div>
        </div>
    );
};

export default PDFEditor;
