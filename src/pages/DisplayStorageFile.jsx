import Header from "../layout/Header";
import Footer from "../layout/Footer";
import React, { useState } from "react";
import DisplayFileUploaded from "../component/filework/file/DisplayFileUploaded";


const DisplayStorageFile = () => {
    

    return (
        <div className=" bg-background text-text">
            <Header />
            <main className="p-8 bg-gray-50">
                <DisplayFileUploaded />
            </main>
            <Footer />
        </div>
    );
};

export default DisplayStorageFile;
