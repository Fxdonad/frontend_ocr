import React from 'react';
import Header from "../../../layout/Header.jsx";
import Footer from "../../../layout/Footer.jsx";
import FileUploadDelete from "./FileUploadDelete.jsx";

function DeletePDF() {
    return (
        <div className="min-h-screen bg-background text-text">
            <Header/>
            <FileUploadDelete />
            <Footer/>
        </div>
    );
}

export default DeletePDF;