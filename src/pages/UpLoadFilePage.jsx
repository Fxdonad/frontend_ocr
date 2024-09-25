import React from "react";
import FileUpload from "../component/filework/file/FileUpload";
import PDFUploaderWithGemini from "../component/filework/ai/PDFUploaderWithGemini";
import PDFEditor from "../component/filework/editpdf/PDFEditor";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

const UpLoadFilePage = () => {


    return (
        <div className="min-h-screen bg-background text-text">
            <Header />
            <main className="p-8 space-y-16 bg-gray-50">
                <FileUpload />
            </main>
            <Footer />
        </div>
    );
};

export default UpLoadFilePage;