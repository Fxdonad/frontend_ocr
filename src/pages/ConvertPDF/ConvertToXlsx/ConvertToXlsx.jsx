import React from 'react';
import Header from "../../../layout/Header.jsx";
import Footer from "../../../layout/Footer.jsx";
import FileUploadConvertToXlsx from "./FileUploadConvertToXlsx.jsx";

function ConvertToXlsx(props) {
    return (
        <div className="min-h-screen bg-background text-text">
            <Header/>
            <FileUploadConvertToXlsx/>
            <Footer/>
        </div>
    );
}

export default ConvertToXlsx;