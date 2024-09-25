import PDFEditor from "../component/filework/editpdf/PDFEditor";
import ImageEditor from "../component/filework/editpdf/ImageEditor";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

const FileEditor = () => {
    return (
        <div className="bg-background text-text">
            <Header />
            <main className="p-8 bg-gray-50">
                <PDFEditor />
                <ImageEditor />
            </main>
            <Footer />
        </div>
    );
};

export default FileEditor;