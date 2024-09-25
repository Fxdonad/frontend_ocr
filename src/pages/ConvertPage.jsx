import ImageToBase64 from "../component/filework/convert/ImageToBase64";
import Header from "../layout/Header"
import Footer from "../layout/Footer"

const ConvertPage = () => {
    return (
        <div>
            <Header />
            <ImageToBase64 />
            <Footer />
        </div>
    );
}

export default ConvertPage;