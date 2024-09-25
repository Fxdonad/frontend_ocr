import FolderList from "../component/filework/folder/FolderList";
import FolderUpload from "../component/filework/folder/FolderUpload";
import React from "react";
import { useState } from "react";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

const UploadFolderPage = () => {
    const [folders, setFolders] = useState([]);

    const handleFolderUploaded = (newFolder) => {
        // Add the new folder to the list of folders
        setFolders((prevFolders) => [...prevFolders, newFolder]);
        console.log("Folder uploaded:", newFolder);
    };

    return (
        <div className=" bg-background text-text">
            <Header />
            <main className="p-8 bg-gray-50">
                <div className="flex flex-col items-center justify-center mt-20">
                    <FolderUpload onFolderUploaded={handleFolderUploaded} />
                    <FolderList folders={folders} />
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default UploadFolderPage;