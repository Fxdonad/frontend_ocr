import React from "react";
import { FaUpload } from "react-icons/fa";
import { FcDataProtection } from "react-icons/fc";
import {
    EditIcon,
    MergeIcon,
  } from "../utils/svgIcons";

const ToolBar = () => {

    return (
        <div className="md:grid md:grid-cols-5 md:gap-8">
            {/* Nén Section */}
            <div>
            <h5 className="mb-4 text-lg font-bold text-text">Upload File</h5>
            <ul className="space-y-2">
                <li>
                <a
                    href="/storage"
                    className="flex items-center text-xs transition-colors duration-300 md:text-base text-text hover:text-primary"
                >
                    {/* Replace with actual icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth="1.5" 
                    stroke="currentColor" 
                    className="mr-1 size-5 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 0 1-3-3m3 3a3 3 0 1 0 0 6h13.5a3 3 0 1 0 0-6m-16.5-3a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3m-19.5 0a4.5 4.5 0 0 1 .9-2.7L5.737 5.1a3.375 3.375 0 0 1 2.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 0 1 .9 2.7m0 0a3 3 0 0 1-3 3m0 3h.008v.008h-.008v-.008Zm0-6h.008v.008h-.008v-.008Zm-3 6h.008v.008h-.008v-.008Zm0-6h.008v.008h-.008v-.008Z" />
                    </svg>
                    Kho lưu trữ
                </a>
                </li>
                <li>
                <a
                    href="/upload-file"
                    className="flex items-center text-xs transition-colors duration-300 md:text-base text-text hover:text-primary"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mr-1 size-5 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>
                    Upload File
                </a>
                </li>
                <li>
                <a
                    href="/upload-folder"
                    className="flex items-center text-xs transition-colors duration-300 md:text-base text-text hover:text-primary"
                >
                    <FaUpload className="mr-2 text-primary" />
                    Upload Folder
                </a>
                </li>
            </ul>
            </div>
            {/* Sắp xếp Section */}
            <div>
            <h5 className="mb-4 text-lg font-bold text-text">
                Sắp xếp
            </h5>
            <ul className="space-y-2">
                <li>
                <a
                    href="/merge"
                    className="flex items-center text-xs transition-colors duration-300 md:text-base text-text hover:text-primary"
                >
                    {MergeIcon}
                    Ghép PDF
                </a>
                </li>
                <li>
                <a
                    href="/delete"
                    className="flex items-center text-xs transition-colors duration-300 md:text-base text-text hover:text-primary"
                >
                    <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-1"
                    >
                    <path
                        d="M5 7H19M10 10V18M14 10V18M10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7H9V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3ZM6 7H18V20C18 20.2652 17.8946 20.5196 17.7071 20.7071C17.5196 20.8946 17.2652 21 17 21H7C6.73478 21 6.48043 20.8946 6.29289 20.7071C6.10536 20.5196 6 20.2652 6 20V7Z"
                        stroke="#887bf2"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    </svg>
                    Xóa các trang PDF
                </a>
                </li>
                <li>
                <a
                    href="/extract"
                    className="flex items-center text-xs transition-colors duration-300 md:text-base text-text hover:text-primary"
                >
                    <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-1 text-primary"
                    >
                    <path
                        d="M10 3V7C10 7.55228 9.55228 8 9 8H5M13 15.5L15.5 18M19 4V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V7.91421C5 7.649 5.10536 7.39464 5.29289 7.20711L9.20711 3.29289C9.39464 3.10536 9.649 3 9.91421 3H18C18.5523 3 19 3.44772 19 4ZM14 13.5C14 14.8807 12.8807 16 11.5 16C10.1193 16 9 14.8807 9 13.5C9 12.1193 10.1193 11 11.5 11C12.8807 11 14 12.1193 14 13.5Z"
                        stroke="#887bf2"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    </svg>
                    Trích xuất các file PDF
                </a>
                </li>
                <li>
                <a
                    href="/split"
                    className="flex items-center text-xs transition-colors duration-300 md:text-base text-text hover:text-primary"
                >
                    {EditIcon}
                    Tách PDF
                </a>
                </li>
            </ul>
            </div>
            <div>
            <h5 className="mb-4 text-lg font-bold text-text">
                Xem & Chỉnh sửa
            </h5>
                <ul className="space-y-2">
                    <li>
                        <a
                            href="/add-text"
                            className="flex items-center text-xs transition-colors duration-300 md:text-base text-text hover:text-primary"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                stroke="currentColor" className="mr-1 size-6 text-primary">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/>
                            </svg>
                            Thêm chữ vào PDF
                        </a>
                    </li>
                    <li>
                        <a
                            href="/add-image"
                            className="flex items-center text-xs transition-colors duration-300 md:text-base text-text hover:text-primary"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="mr-1 size-6 text-primary">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"/>
                            </svg>
                            Thêm ảnh vào PDF
                        </a>
                    </li>
                    <li>
                        <a
                            href="/set-pageSize"
                            className="flex items-center text-xs transition-colors duration-300 md:text-base text-text hover:text-primary"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="mr-1 size-6 text-primary">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="m8.99 14.993 6-6m6 3.001c0 1.268-.63 2.39-1.593 3.069a3.746 3.746 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043 3.745 3.745 0 0 1-3.068 1.593c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 0 1-3.296-1.043 3.746 3.746 0 0 1-1.043-3.297 3.746 3.746 0 0 1-1.593-3.068c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 0 1 1.043-3.297 3.745 3.745 0 0 1 3.296-1.042 3.745 3.745 0 0 1 3.068-1.594c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.297 3.746 3.746 0 0 1 1.593 3.068ZM9.74 9.743h.008v.007H9.74v-.007Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm4.125 4.5h.008v.008h-.008v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"/>
                            </svg>
                            Chỉnh cỡ trang
                        </a>
                    </li>
                    <li>
                        <a
                            href="/set-fontSize"
                            className="flex items-center text-xs transition-colors duration-300 md:text-base text-text hover:text-primary"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="mr-1 size-6 text-primary">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5"/>
                            </svg>
                            Chỉnh cỡ chữ
                        </a>
                    </li>
                </ul>
            </div>
            <div>
                <h5 className="mb-4 text-lg font-bold text-text">
                    Chuyển đổi từ PDF
                </h5>
                <ul className="space-y-2">
                    <li>
                        <a
                            href="/convert-toDocx"
                            className="flex items-center text-xs transition-colors duration-300 md:text-base text-text hover:text-primary"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="w-5 h-5 mr-2 text-secondary"
                            >
                                <path
                                    d="M10 3V7C10 7.55228 9.55228 8 9 8H5M9 12L10 17L12 13.6667L14 17L15 12M19 4V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V7.91421C5 7.649 5.10536 7.39464 5.29289 7.20711L9.20711 3.29289C9.39464 3.10536 9.649 3 9.91421 3H18C18.5523 3 19 3.44772 19 4Z"
                                    stroke="#887bf2"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            PDF sang Word
                        </a>
                    </li>
                    <li>
                        <a
                            href="/convert-toXlsx"
                            className="flex items-center text-xs transition-colors duration-300 md:text-base text-text hover:text-primary"
                >
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="w-5 h-5 mr-2 text-secondary"
                    >
                    <path
                        d="M10 3V7C10 7.55228 9.55228 8 9 8H5M13 6H16M13 9H16M12 12V18M16 15H8M19 4V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V7.91421C5 7.649 5.10536 7.39464 5.29289 7.20711L9.20711 3.29289C9.39464 3.10536 9.649 3 9.91421 3H18C18.5523 3 19 3.44772 19 4ZM8 12V18H16V12H8Z"
                        stroke="#887bf2"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    </svg>
                    PDF sang Excel
                </a>
                </li>
                <li>
                <a
                    href="/convert-toPptx"
                    className="flex items-center text-xs transition-colors duration-300 md:text-base text-text hover:text-primary"
                >
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="w-5 h-5 mr-2 text-secondary"
                    >
                    <path
                        d="M5 17V12H6.5C6.89782 12 7.27936 12.158 7.56066 12.4393C7.84196 12.7206 8 13.1022 8 13.5C8 13.8978 7.84196 14.2794 7.56066 14.5607C7.27936 14.842 6.89782 15 6.5 15H5M11 17V12H12.5C12.8978 12 13.2794 12.158 13.5607 12.4393C13.842 12.7206 14 13.1022 14 13.5C14 13.8978 13.842 14.2794 13.5607 14.5607C13.2794 14.842 12.8978 15 12.5 15H11M18 12V17M17 12H19M5 10V7.91421C5 7.649 5.10536 7.39464 5.29289 7.20711L9.20711 3.29289C9.39464 3.10536 9.649 3 9.91422 3H18C18.5523 3 19 3.44772 19 4V10M5 19V20C5 20.5523 5.44772 21 6 21H18C18.5523 21 19 20.5523 19 20V19M10 3V7C10 7.55228 9.55229 8 9 8H5"
                        stroke="#887bf2"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    </svg>
                    PDF sang PPT
                </a>
                </li>
                <li>
                <a
                    href="/convert-toImage"
                    className="flex items-center text-xs transition-colors duration-300 md:text-base text-text hover:text-primary"
                >
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="w-5 h-5 mr-2 text-secondary"
                    >
                    <path
                        d="M16 18H8L10.5 12L12.5 16L14 14L16 18Z"
                        fill="#383838"
                    />
                    <path
                        d="M15 9.5C15 9.77614 14.7761 10 14.5 10C14.2239 10 14 9.77614 14 9.5C14 9.22386 14.2239 9 14.5 9C14.7761 9 15 9.22386 15 9.5Z"
                        fill="#383838"
                    />
                    <path
                        d="M10 3V7C10 7.55228 9.55228 8 9 8H5M19 4V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V7.91421C5 7.649 5.10536 7.39464 5.29289 7.20711L9.20711 3.29289C9.39464 3.10536 9.649 3 9.91421 3H18C18.5523 3 19 3.44772 19 4ZM8 18H16L14 14L12.5 16L10.5 12L8 18ZM15 9.5C15 9.77614 14.7761 10 14.5 10C14.2239 10 14 9.77614 14 9.5C14 9.22386 14.2239 9 14.5 9C14.7761 9 15 9.22386 15 9.5Z"
                        stroke="#887bf2"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    </svg>
                    PDF sang JPG
                </a>
                </li>
                <li>
                <a
                    href="/convert"
                    className="flex items-center text-xs transition-colors duration-300 md:text-base text-text hover:text-primary"
                >
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="w-5 h-5 mr-2 text-secondary"
                    >
                    <path
                        d="M5 17V12H6.5C6.89782 12 7.27936 12.158 7.56066 12.4393C7.84196 12.7206 8 13.1022 8 13.5C8 13.8978 7.84196 14.2794 7.56066 14.5607C7.27936 14.842 6.89782 15 6.5 15H5M17 17V12H19M17 15H19M5 10V7.91421C5 7.649 5.10536 7.39464 5.29289 7.20711L9.20711 3.29289C9.39464 3.10536 9.649 3 9.91422 3H18C18.5523 3 19 3.44772 19 4V10M5 19V20C5 20.5523 5.44772 21 6 21H18C18.5523 21 19 20.5523 19 20V19M10 3V7C10 7.55228 9.55229 8 9 8H5M11 12V17H12.375C12.8059 16.9997 13.2191 16.8284 13.5238 16.5238C13.8284 16.2191 13.9997 15.8059 14 15.375V13.625C13.9997 13.1941 13.8284 12.7809 13.5238 12.4762C13.2191 12.1716 12.8059 12.0003 12.375 12H11Z"
                        stroke="#887bf2"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    </svg>
                    PDF OCR
                </a>
                </li>
            </ul>
            </div>
            {/* Additional Features Section */}
            <div>
                <h5 className="mb-4 text-lg font-bold text-text">
                    Thêm
                </h5>
                <ul className="space-y-2">
                    <li>
                        <a
                            href="/set-password"
                            className="flex items-center text-xs transition-colors duration-300 md:text-base text-text hover:text-primary"
                        >
                            <FcDataProtection className="mr-1 size-6 text-primary"/>
                            Bảo vệ PDF
                        </a>
                    </li>
                </ul>
                <ul className="mt-2 space-y-2">
                    <li>
                        <a
                            href="/update-properties"
                            className="flex items-center text-xs transition-colors duration-300 md:text-base text-text hover:text-primary"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                stroke="currentColor" className="mr-1 size-6 text-primary">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"/>
                            </svg>
                            Cập nhật thông tin PDF
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default ToolBar;