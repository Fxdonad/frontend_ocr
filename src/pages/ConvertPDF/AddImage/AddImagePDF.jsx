import React from 'react';
import Header from "../../../layout/Header.jsx";
import Footer from "../../../layout/Footer.jsx";
import FileUploadAddImage from "./FileUploadAddImage.jsx";

function AddImagePdf(props) {
    return (
        <div className="min-h-screen bg-background text-text">
            <Header/>
            <FileUploadAddImage/>
            <Footer/>
        </div>
    );
}

export default AddImagePdf;