import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UpLoadFilePage from "./pages/UpLoadFilePage";
import ProfilePage from "./pages/ProfilePage";
import FileEditor from "./pages/FileEditor";
import AiChatBot from "./pages/AiChatBot";
import DisplayStorageFile from "./pages/DisplayStorageFile";
import PaymentManager from "./pages/PaymentManager";
import ConvertPage from "./pages/ConvertPage";
import UploadFolderPage from "./pages/UploadFolderPage";
import ServicePage from "./pages/ServicePage";
import DeletePDF from "./pages/ConvertPDF/Delete/DeletePDF.jsx";
import ExtractPdf from "./pages/ConvertPDF/Extract/ExtractPDF.jsx";
import MergePdf from "./pages/ConvertPDF/Merge/MergePDF.jsx";
import UpdateProperties from "./pages/ConvertPDF/Update Properties/UpdateProperties.jsx";
import AddTextPdf from "./pages/ConvertPDF/AddText/AddTextPDF.jsx";
import SplitPdf from "./pages/ConvertPDF/Split/SplitPDF.jsx";
import AddImagePdf from "./pages/ConvertPDF/AddImage/AddImagePDF.jsx";
import ConvertToImage from "./pages/ConvertPDF/ConvertToImage/ConvertToImage.jsx";
import ConvertToDocx from "./pages/ConvertPDF/ConvertToDocx/ConvertToDocx.jsx";
import ConvertToXlsx from "./pages/ConvertPDF/ConvertToXlsx/ConvertToXlsx.jsx";
import ConvertToPptx from "./pages/ConvertPDF/ConvertToPptx/ConvertToPptx.jsx";
import SetPageSize from "./pages/ConvertPDF/SetPDFPageSize/SetPageSize.jsx";
import SetFontAndSize from "./pages/ConvertPDF/SetPDFFontSize/SetFontAndSize.jsx";
import SetPassword from "./pages/ConvertPDF/SetPassword/SetPassword.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import PrivateRoute from "./component/PrivateRoute"; // Import PrivateRoute component
import NotFound from "./pages/NotFound"; // Import NotFound component
import AdminManage from "./pages/adminpages/AdminManage.jsx";
import AdminUserListPage from "./pages/adminpages/AdminUserListPage.jsx";
import ViewUserDetail from "./pages/adminpages/ViewUserDetail.jsx";
import FAQPage from "./pages/feedback/FAQPage.jsx";
import AdminFAQPage from "./pages/feedback/AdminFAQPage.jsx";

function App() {
  return (
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected Routes */}
            <Route path="/upload-file" element={<PrivateRoute element={UpLoadFilePage} />} />
            <Route path="/upload-folder" element={<PrivateRoute element={UploadFolderPage} />} />
            <Route path="/profile" element={<PrivateRoute element={ProfilePage} />} />
            <Route path="/editpdf" element={<PrivateRoute element={FileEditor} />} />
            <Route path="/chat" element={<PrivateRoute element={AiChatBot} />} />
            <Route path="/storage" element={<PrivateRoute element={DisplayStorageFile} />} />
            <Route path="/payment" element={<PrivateRoute element={PaymentManager} />} />
            <Route path="/convert" element={<PrivateRoute element={ConvertPage} />} />
            <Route path="/service" element={<PrivateRoute element={ServicePage} />} />

            <Route path="/split" element={<PrivateRoute element={SplitPdf} />} />
            <Route path="/delete" element={<PrivateRoute element={DeletePDF} />} />
            <Route path="/extract" element={<PrivateRoute element={ExtractPdf} />} />
            <Route path="/merge" element={<PrivateRoute element={MergePdf} />} />
            <Route path="/update-properties" element={<PrivateRoute element={UpdateProperties} />} />
            <Route path="/add-text" element={<PrivateRoute element={AddTextPdf} />} />
            <Route path="/add-image" element={<PrivateRoute element={AddImagePdf} />} />
            <Route path="/convert-toImage" element={<PrivateRoute element={ConvertToImage} />} />
            <Route path="/convert-toDocx" element={<PrivateRoute element={ConvertToDocx} />} />
            <Route path="/convert-toXlsx" element={<PrivateRoute element={ConvertToXlsx} />} />
            <Route path="/convert-toPptx" element={<PrivateRoute element={ConvertToPptx} />} />
            <Route path="/set-pageSize" element={<PrivateRoute element={SetPageSize} />} />
            <Route path="/set-fontSize" element={<PrivateRoute element={SetFontAndSize} />} />
            <Route path="/set-password" element={<PrivateRoute element={SetPassword} />} />
              
            {/* Admin Routes */}
            <Route path="/admin-dashboard" element={<PrivateRoute element={AdminManage} />} />
            <Route path="/admin/users" element={<PrivateRoute element={AdminUserListPage} />} />
            <Route path="/admin/user/:userID" element={<PrivateRoute element={ViewUserDetail} />} />

            {/* FAQ Route */}
            <Route path="/faq-user" element={<PrivateRoute element={FAQPage} />} />
            <Route path="/faq-admin" element={<PrivateRoute element={AdminFAQPage} />} />

            {/* 404 Not Found Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
