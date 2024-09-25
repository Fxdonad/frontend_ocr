import PDFUploaderWithGemini from "../component/filework/ai/PDFUploaderWithGemini";
import ChatInterface from "../component/filework/ai/ChatInterFace";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

const AiChatBot = () => {
    return (
        <div className="min-h-screen bg-background text-text">
            <Header />
            <main className="p-8 space-y-16 bg-gray-50">
                <PDFUploaderWithGemini />
                <ChatInterface />
            </main>
            <Footer />
        </div>
    );
}

export default AiChatBot;