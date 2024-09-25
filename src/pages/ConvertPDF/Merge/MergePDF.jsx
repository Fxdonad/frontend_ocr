import React from 'react';
import Header from "../../../layout/Header.jsx";
import Footer from "../../../layout/Footer.jsx";
import FileUploadMerge from "./FileUploadMerge.jsx";

function MergePdf(props) {
    return (
        <div className="min-h-screen bg-background text-text">
            <Header/>
            <FileUploadMerge/>
            <Footer/>
        </div>
    );
}

export default MergePdf;