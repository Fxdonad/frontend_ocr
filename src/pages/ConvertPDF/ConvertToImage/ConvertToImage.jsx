import React from 'react';
import Header from "../../../layout/Header.jsx";
import Footer from "../../../layout/Footer.jsx";
import FileUploadConvertToImage from "./FileUploadConvertToImage.jsx";

function ConvertToImage() {
    return (
        <div className="min-h-screen bg-background text-text">
            <Header/>
            <FileUploadConvertToImage/>
            <Footer/>
        </div>
    );
}

export default ConvertToImage;