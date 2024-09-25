import React from "react";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import videoSource from "../assets/videos/videobackground.mp4";
import { AiOutlineCheckCircle, AiOutlineCloudUpload, AiOutlineRocket } from 'react-icons/ai';
import { FaRegSmileBeam, FaUserShield, FaCogs } from 'react-icons/fa';
import Slider from "react-slick"; // Import Slider từ react-slick
import "slick-carousel/slick/slick.css"; // Import CSS của slick-carousel
import "slick-carousel/slick/slick-theme.css";


const Home = () => {
  // Cấu hình cho Slider
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
  };

  return (
    <>
      <Header />
      <div className="relative pt-12 bg-background text-text">
        {/* Video nền */}
        <video
          className="absolute top-0 left-0 object-cover w-full h-full opacity-80"
          autoPlay
          loop
          muted
        >
          <source src={videoSource} type="video/mp4" />
          Trình duyệt của bạn không hỗ trợ video.
        </video>

        {/* Lớp phủ nội dung */}
        <div className="relative z-10 min-h-screen">
          <main className="p-12 space-y-12 bg-gray-900 bg-opacity-70">
            <div className="flex items-center pt-10 mx-auto space-y-8 max-w-7xl lg:flex-row lg:space-y-0 lg:space-x-8">
              {/* Phần Trái: Nội dung Văn bản */}
              <div className="lg:w-1/2">
                <h1 className="mb-6 text-4xl font-extrabold leading-tight text-white">
                  Chuyển đổi hình ảnh và văn bản viết tay thành tài liệu số với công nghệ OCR.
                </h1>
                <p className="mb-6 text-lg text-gray-200">
                  Sử dụng sức mạnh của OCR để nâng cao hiệu suất và sự chính xác trong công việc của bạn.
                </p>
              </div>
            </div>

            {/* Thêm thành phần trang trí dưới tiêu đề */}
            <div className="mt-12">
              <h2 className="mb-8 text-3xl font-bold text-center text-white">
                Các lợi ích khi sử dụng OCR
              </h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {/* Chèn ảnh banner ở đây */}
                <div className="p-6 bg-white rounded-lg shadow-lg bg-opacity-10">
                  <Slider {...sliderSettings}>
                    {/* Slide 1 */}
                    <div>
                      <img
                        src="src/assets/OCR_Offline-1400x602.png"
                        alt="Minh họa OCR 1"
                        className="object-cover w-full h-auto rounded-lg shadow-lg"
                      />
                    </div>
                    {/* Slide 2 */}
                    <div>
                      <img
                        src="src/assets/QuickScan.png"
                        alt="Minh họa OCR 2"
                        className="object-cover w-full h-auto rounded-lg shadow-lg"
                      />
                    </div>
                    {/* Slide 3 */}
                    <div>
                      <img
                        src="src/assets/OCR-Software.jpg"
                        alt="Minh họa OCR 3"
                        className="object-cover w-full h-auto rounded-lg shadow-lg"
                      />
                    </div>
                  </Slider>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-lg bg-opacity-10">
                  <Slider {...sliderSettings}>
                    {/* Lợi ích 1 */}
                    <div className="p-6 bg-white rounded-lg shadow-lg bg-opacity-10">
                      <div className="flex items-center mb-4">
                        <FaRegSmileBeam className="w-10 h-10 text-yellow-400" />
                        <h3 className="ml-4 text-xl font-semibold text-white">Tiết kiệm thời gian</h3>
                      </div>
                      <p className="text-gray-200">
                        Chuyển đổi tài liệu nhanh chóng, giảm thời gian nhập liệu thủ công.
                      </p>
                    </div>
                    {/* Lợi ích 2 */}
                    <div className="p-6 bg-white rounded-lg shadow-lg bg-opacity-10">
                      <div className="flex items-center mb-4">
                        <FaUserShield className="w-10 h-10 text-green-400" />
                        <h3 className="ml-4 text-xl font-semibold text-white">An toàn và bảo mật</h3>
                      </div>
                      <p className="text-gray-200">
                        Dữ liệu của bạn được bảo vệ với công nghệ mã hóa tiên tiến.
                      </p>
                    </div>
                    {/* Lợi ích 3 */}
                    <div className="p-6 bg-white rounded-lg shadow-lg bg-opacity-10">
                      <div className="flex items-center mb-4">
                        <FaCogs className="w-10 h-10 text-blue-400" />
                        <h3 className="ml-4 text-xl font-semibold text-white">Tích hợp dễ dàng</h3>
                      </div>
                      <p className="text-gray-200">
                        Dễ dàng tích hợp vào quy trình làm việc hiện tại của bạn.
                      </p>
                    </div>
                  </Slider>
                </div> 
              </div>
            </div>

            {/* Phần Bổ sung: Danh sách Tính năng OCR */}
            <div className="mt-12">
              <h2 className="mb-8 text-3xl font-bold text-center text-white">
                Tại sao chọn công nghệ OCR của chúng tôi?
              </h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {/* Tính năng 1 */}
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-white rounded-lg shadow-md bg-opacity-20">
                    <AiOutlineCheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Chuyển đổi chính xác cao</h3>
                    <p className="text-gray-200">
                      Công nghệ OCR tiên tiến đảm bảo chuyển đổi chính xác từ hình ảnh sang văn bản số.
                    </p>
                  </div>
                </div>
                {/* Tính năng 2 */}
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-white rounded-lg shadow-md bg-opacity-20">
                    <AiOutlineCloudUpload className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Hỗ trợ lưu trữ file</h3>
                    <p className="text-gray-200">
                      Dễ dàng quản lý các file và thư mục trực tuyến và đa nền tảng.
                    </p>
                  </div>
                </div>
                {/* Tính năng 3 */}
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-white rounded-lg shadow-md bg-opacity-20">
                    <AiOutlineRocket className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Nhanh chóng và dễ dàng</h3>
                    <p className="text-gray-200">
                      Chuyển đổi tài liệu của bạn chỉ trong vài giây với giao diện thân thiện.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Home;
