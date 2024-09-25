import React, { useState } from 'react';
import { FaTrashAlt, FaUndo, FaRedo } from 'react-icons/fa';

const ImageEditor = () => {
    const [images, setImages] = useState([]);
    const [rotations, setRotations] = useState({});

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        const newImages = selectedFiles.map((file) => {
        const reader = new FileReader();
        return new Promise((resolve) => {
            reader.onload = (e) => {
            resolve({
                file,
                src: e.target.result,
            });
            };
            reader.readAsDataURL(file);
        });
        });

        Promise.all(newImages).then((filesData) => {
        setImages((prevImages) => [...prevImages, ...filesData]);
        });
    };

    const rotateImage = (index, direction) => {
        setRotations((prevRotations) => {
        const newRotations = { ...prevRotations };
        if (!newRotations[index]) {
            newRotations[index] = 0;
        }
        newRotations[index] += direction === 'left' ? -90 : 90;
        return newRotations;
        });
    };

    const deleteImage = (index) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
        setRotations((prevRotations) => {
        const newRotations = { ...prevRotations };
        delete newRotations[index];
        return newRotations;
        });
    };

    return (
        <div className="flex flex-col items-center justify-center mt-10 p-6 bg-gray-100">
        <div className="w-full max-w-5xl p-8 bg-white rounded-lg shadow-lg">
            <h1 className="mb-6 text-2xl font-bold text-center text-gray-800">
            Image Editor
            </h1>
            <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
                Upload Images
            </label>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                multiple
                className="w-full p-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            </div>

            <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image, index) => (
                <div key={index} className="relative p-4 bg-gray-50 rounded-lg shadow-md">
                <div className="flex justify-between mb-2">
                    <button
                    onClick={() => rotateImage(index, 'left')}
                    className="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-700"
                    >
                    <FaUndo />
                    </button>
                    <button
                    onClick={() => rotateImage(index, 'right')}
                    className="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-700"
                    >
                    <FaRedo />
                    </button>
                    <button
                    onClick={() => deleteImage(index)}
                    className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-700"
                    >
                    <FaTrashAlt />
                    </button>
                </div>
                <div
                    style={{
                    transform: `rotate(${rotations[index] || 0}deg)`,
                    transition: 'transform 0.3s ease-in-out',
                    }}
                >
                    <img
                    src={image.src}
                    alt={`Uploaded ${index}`}
                    className="w-full h-auto rounded"
                    />
                </div>
                </div>
            ))}
            </div>

            {images.length > 0 && (
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

export default ImageEditor;
