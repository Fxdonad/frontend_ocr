import React from 'react';
import Header from "../../../layout/Header.jsx";
import Footer from "../../../layout/Footer.jsx";
import FileUploadSetFontAndSize from "./FileUploadSetFontAndSize.jsx";

function SetFontAndSize(props) {
    return (
        <div className="min-h-screen bg-background text-text">
            <Header/>
            <FileUploadSetFontAndSize/>
            <Footer/>
        </div>
    );
}

export default SetFontAndSize;