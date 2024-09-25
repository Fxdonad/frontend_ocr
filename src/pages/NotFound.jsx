import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
            <h1 className="text-6xl font-bold text-red-600">404</h1>
            <p className="mt-4 text-2xl">Oops! The page you're looking for doesn't exist.</p>
            <Link to="/" className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300">
                Go Back Home
            </Link>
        </div>
    );
};

export default NotFound;
