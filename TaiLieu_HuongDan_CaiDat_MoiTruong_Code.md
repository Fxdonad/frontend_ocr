
# Tài Liệu Hướng Dẫn Cài Đặt Môi Trường và Code

## 1. Giới Thiệu
- **Tên dự án:** OCRServiceCMC
- **Mô tả:** Là phần mềm cho phép quét nội dung từ ảnh và quản lý file của người dùng.
- **Yêu cầu:** Danh sách các yêu cầu phần mềm, phần cứng, và công cụ cần thiết để phát triển và triển khai dự án.

## 2. Yêu Cầu Hệ Thống
- **Hệ điều hành:** Window
- **Phần mềm cần thiết:**
  - **Java:** [Java 17+]
  - **Node.js:** [Node.js 16+]
  - **Database:** [SQL Server 2019+]
  - **IDE:** IntelliJ IDEA, Visual Studio Code]
  - **Các công cụ khác:** [Git]

## 3. Hướng Dẫn Cài Đặt Môi Trường
### 3.1. Cài Đặt Java
- **Bước 1:** Tải và cài đặt [Java từ trang chủ](https://www.oracle.com/java/technologies/javase-downloads.html).
- **Bước 2:** Thiết lập biến môi trường `JAVA_HOME`.
- **Bước 3:** Kiểm tra cài đặt bằng lệnh `java -version`.

### 3.2. Cài Đặt Node.js
- **Bước 1:** Tải và cài đặt [Node.js từ trang chủ](https://nodejs.org/).
- **Bước 2:** Kiểm tra cài đặt bằng lệnh `node -v` và `npm -v`.

### 3.3. Cài Đặt Database
- **Bước 1:** Tải và cài đặt [SQL Server từ trang chủ](https://www.microsoft.com/en-us/sql-server/sql-server-downloads).
- **Bước 2:** Sử dụng file Backup_OCR.bak để backup database của dự án.
- **Bước 3:** Cấu hình user và mật khẩu truy cập.

### 3.4. Cài Đặt IDE
- **Bước 1:** Tải và cài đặt [IntelliJ IDEA từ trang chủ](https://www.jetbrains.com/idea/download/) hoặc [Visual Studio Code](https://code.visualstudio.com/Download).
- **Bước 2:** Cài đặt các plugin cần thiết.

## 4. Hướng Dẫn Thiết Lập Dự Án
### 4.1. Clone Dự Án
- **Bước 1:** Clone dự án từ GitHub:
  + Clone các repositories từ github: [https://github.com/orgs/OCRServiceCMC/repositories](https://github.com/orgs/OCRServiceCMC/repositories)
  + Clone datatrain của Tesseract: [https://github.com/tesseract-ocr/tessdata](https://github.com/tesseract-ocr/tessdata)
  + Tải file font chữ mà bạn muốn dùng.

### 4.2. Cấu Hình Database
- **Bước 1:** Mở file cấu hình `application.properties`.
- **Bước 2:** Cập nhật thông tin kết nối database:

  + spring.datasource.url=jdbc:mysql://localhost:8081/[Tên database] 
  + spring.datasource.username=[username] 
  + spring.datasource.password=[password] 


### 4.3. Cấu Hình nơi lưu file
- **Bước 1:** Mở file cấu hình `.env`.
- **Bước 2:** Cập nhật thông tin các đường dẫn mà bạn muốn lưu file:
 
    + **IMAGE_OUTPUT_DIRECTORY**=D:\\Project\\Project_WebOCR\\file_uploads\\ (ví dụ)
    + **PDF_OUTPUT_DIRECTORY**=D:\\Project\\Project_WebOCR\\file_uploads\\ (ví dụ)
    + **TESSDATA_PATH**=D:\\Project\\Project_WebOCR\\backend_ocr\\src\\main\\resources\\traindata\\tessdata (ví dụ)
    + **FONT_PATH**=D:\\Project\\Project_WebOCR\\backend_ocr\\src\\main\\resources\\fonts\\DejaVuSansExtraLight.ttf (ví dụ)


### 4.4. Chạy Ứng Dụng
- **Bước 1:** Chạy ứng dụng backend bằng lệnh:

  + ./mvnw spring-boot:run hoặc bấm nút start trên IntelliJ
- **Bước 2:** Chạy ứng dụng frontend bằng lệnh:
  **npm run dev**


## 5. Hướng Dẫn Sử Dụng Code
### 5.1. Cấu Trúc Thư Mục
- Mô tả cấu trúc thư mục của dự án, bao gồm các thư mục chính như `src`, `config`, `controllers`, `services`, `models`, `views`, v.v.

### 5.2. Tài Liệu API
- Hãy import các file json trong repository postman_testing vào trong phần mềm postman để kiểm thử.

### 5.3. Các Tài Liệu Khác
- Hướng dẫn tạo các chức năng cụ thể nếu cần.
- Hướng dẫn xử lý lỗi phổ biến.
