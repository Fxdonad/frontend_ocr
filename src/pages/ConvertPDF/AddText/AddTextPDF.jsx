import React from 'react';
import Header from "../../../layout/Header.jsx";
import Footer from "../../../layout/Footer.jsx";
import FileUploadAddText from "./FileUploadAddText.jsx";

function AddTextPdf(props) {
    return (
        <div className="min-h-screen bg-background text-text">
            <Header/>
            <FileUploadAddText/>
            <Footer/>
        </div>
    );
}

export default AddTextPdf;