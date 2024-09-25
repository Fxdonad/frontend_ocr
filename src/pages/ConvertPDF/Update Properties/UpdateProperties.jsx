import React from 'react';
import Header from "../../../layout/Header.jsx";
import Footer from "../../../layout/Footer.jsx";
import FileUploadUpdate from "./FileUploadUpdate.jsx";

function UpdateProperties(props) {
    return (
        <div className="min-h-screen bg-background text-text">
            <Header/>
            <FileUploadUpdate/>
            <Footer/>
        </div>
    );
}

export default UpdateProperties;