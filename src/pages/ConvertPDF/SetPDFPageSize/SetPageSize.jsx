import React from 'react';
import Header from "../../../layout/Header.jsx";
import Footer from "../../../layout/Footer.jsx";
import FileUploadSetPageSize from "./FileUploadSetPageSize.jsx";

function SetPageSize(props) {
    return (
        <div className="min-h-screen bg-background text-text">
            <Header/>
            <FileUploadSetPageSize/>
            <Footer/>
        </div>
    );
}

export default SetPageSize;