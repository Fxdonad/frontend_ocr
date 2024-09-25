import React from 'react';
import Header from "../../../layout/Header.jsx";
import Footer from "../../../layout/Footer.jsx";
import FileUploadExtract from "./FileUploadExtract.jsx";

function ExtractPdf(props) {
    return (
        <div className="min-h-screen bg-background text-text">
            <Header/>
            <FileUploadExtract/>
            <Footer/>
        </div>
    );
}

export default ExtractPdf;