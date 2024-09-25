import React from "react";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import ServiceInfo from "../component/payment/ServiceInfo";

const ServicePage = () => {


    return (
        <div className="min-h-screen bg-background text-text">
            <Header />
            <main className="pt-16 space-y-16 bg-gray-50">
                <ServiceInfo />
            </main>
            <Footer />
        </div>
    );
};

export default ServicePage;