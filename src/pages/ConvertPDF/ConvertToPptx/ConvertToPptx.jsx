import React from 'react';
import Header from "../../../layout/Header.jsx";
import Footer from "../../../layout/Footer.jsx";
import FileUploadConvertToPptx from "./FileUploadConvertToPptx.jsx";

function ConvertToPptx(props) {
    return (
        <div className="min-h-screen bg-background text-text">
            <Header/>
            <FileUploadConvertToPptx/>
            <Footer/>
        </div>
    );
}

export default ConvertToPptx;