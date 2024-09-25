import React from 'react';
import Header from "../../../layout/Header.jsx";
import Footer from "../../../layout/Footer.jsx";
import FileUploadSplit from "./FileUploadSplit.jsx";

function SplitPdf() {
    return (
        <div className="min-h-screen bg-background text-text">
            <Header/>
                <FileUploadSplit />
            <Footer/>
        </div>
    );
}

export default SplitPdf;