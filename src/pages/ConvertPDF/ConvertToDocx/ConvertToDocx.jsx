import React from 'react';
import Header from "../../../layout/Header.jsx";
import Footer from "../../../layout/Footer.jsx";
import FileUploadConvertToDocx from "./FileUploadConvertToDocx.jsx";

function ConvertToDocx(props) {
    return (
        <div className="min-h-screen bg-background text-text">
            <Header/>
            <FileUploadConvertToDocx/>
            <Footer/>
        </div>
    );
}

export default ConvertToDocx;