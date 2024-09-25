import React from 'react';
import Header from "../../../layout/Header.jsx";
import Footer from "../../../layout/Footer.jsx";
import FileUploadSetPassword from "./FileUploadSetPassword.jsx";

function SetPassword(props) {
    return (
        <div className="min-h-screen bg-background text-text">
            <Header/>
            <FileUploadSetPassword/>
            <Footer/>
        </div>
    );
}

export default SetPassword;