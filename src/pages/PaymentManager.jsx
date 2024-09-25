import Payment from "../component/payment/Payment";
import GPBalance from "../component/payment/GPBlance";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

const PaymentManager = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Header />
            <div className="flex flex-col items-center justify-around min-h-screen px-6 pt-20 mb-10">
                <div className="flex flex-col justify-between w-full max-w-6xl p-6 bg-white rounded-lg shadow-lg md:flex-row">
                    <div className="w-full p-4 md:w-1/2">
                        <GPBalance />
                    </div>
                    <div className="w-full p-4 md:w-1/2">
                        <Payment />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PaymentManager;
