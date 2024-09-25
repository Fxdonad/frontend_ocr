import React, { useState, useEffect } from "react";
import ToolBar from "./ToolBar";
import { useNavigate } from "react-router-dom";
import { RiDashboard2Line } from "react-icons/ri";
import { FaUsersViewfinder, FaQuestion } from "react-icons/fa6";
import { MdOutlineDocumentScanner } from "react-icons/md";
import Img from "../assets/3GP_LOGO.png";

import {
  ToolIcon,
  CompressIcon,
  ConvertIcon,
  AIPDFIcon,
  EditIcon,
  MergeIcon,
  SignIcon,
  ProtectIcon,
} from "../utils/svgIcons";

const Header = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Added to navigate after logout
  const [role, setRole] = useState(null); // State to store the user's role

  useEffect(() => {
    // Check if there's a token in sessionStorage
    const token = sessionStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
      fetchUserRole(token); // Fetch user role when logged in
    }
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const fetchUserRole = async (token) => {
    try {
      const response = await fetch("http://localhost:8081/api/auth/user-details", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setRole(data.role); // Store the role in the state
      } else {
        throw new Error("Failed to fetch user details");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    const token = sessionStorage.getItem("authToken");
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        sessionStorage.removeItem("authToken");
        setIsLoggedIn(false);
        navigate("/login"); // Navigate user to the login page
      } else {
        throw new Error("Failed to logout");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <header className="fixed z-50 w-full px-4 py-2 bg-white shadow-md md:px-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={Img}// Replace this with your actual logo path
            alt="Logo"
            className="w-8 h-10 mr-2"
          />
          <a
            href="/"
            className="text-xl font-extrabold transition-all duration-300 cursor-pointer md:text-3xl text-primary hover:text-accent"
          >
            GPOCRpdf
          </a>
        </div>
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-primary focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
        <nav className="items-center hidden ml-8 space-x-4 md:flex">
          {isLoggedIn && role === "User" && (
            <>
              <div className="">
              <button
                onClick={toggleDropdown}
                className="flex items-center transition-colors duration-300 text-text hover:text-primary"
              >
                {ToolIcon}
                Công cụ
              </button>
              {isDropdownOpen && 
                <div className="absolute left-0 w-screen p-6 py-2 mt-2 bg-white border border-gray-200 shadow-lg">
                  <ToolBar />
                </div>
              }
              </div>
            
              <a
                href="/convert"
                className="flex items-center transition-colors duration-300 text-text hover:text-primary"
              >
                <MdOutlineDocumentScanner  className="mr-1 text-primary size-5"/>
                Chuyển đổi OCR
              </a>
              
              <a
                href="/editpdf"
                className="flex items-center transition-colors duration-300 text-text hover:text-primary"
              >
                {EditIcon}
                Chỉnh sửa
              </a>
              
              <a
                href="/chat"
                className="flex items-center transition-colors duration-300 text-text hover:text-primary"
              >
                {AIPDFIcon}
                AI PDF
              </a>

              <a
                href="/faq-user"
                className="flex items-center transition-colors duration-300 text-text hover:text-primary"
              >
                <FaQuestion className="mr-1 text-primary"/>
                FAQ
              </a>
            </>
            )
          }
          {isLoggedIn && role === "ADMIN" && (
            <>
              <a
                href="/admin-dashboard"
                className="flex items-center p-2 transition-colors duration-300 rounded-md shadow-md bg-slate-100 hover:bg-slate-200 text-text hover:text-primary"
              >
                <RiDashboard2Line className="mr-1 size-6"/>
                Dashboard
              </a>
              <a
                href="/admin/users"
                className="flex items-center p-2 transition-colors duration-300 rounded-md shadow-md bg-slate-100 hover:bg-slate-200 text-text hover:text-primary"
              >
                <FaUsersViewfinder className="mr-1 size-6"/>
                View Users
              </a>
              <a
                href="/faq-admin"
                className="flex items-center p-2 transition-colors duration-300 rounded-md shadow-md bg-slate-100 hover:bg-slate-200 text-text hover:text-primary"
              >
                <FaQuestion className="mr-1 size-6"/>
                Answer FAQs
              </a>
            </>
            )
          }
        </nav>
        <div className="items-center hidden space-x-3 md:flex">
          {isLoggedIn && role === "User" && (
            <>
              <a
                href="/payment"
                className="flex items-center px-3 py-2 text-lg text-left text-gray-700 transition-colors duration-300 rounded-lg shadow-md hover:scale-110 hover:text-primary hover:bg-slate-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mr-1 size-6 ">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
                </svg>
                Tài khoản
              </a>
              <a
                href="/service"
                className="flex items-center px-3 py-2 text-lg text-left text-gray-700 transition-colors duration-300 rounded-lg shadow-md hover:scale-110 hover:text-primary hover:bg-slate-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mr-1 size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
                </svg>
                Dịch vụ
              </a>
            </>
          )}
          {isLoggedIn ? (
            <div className="flex">
              <a href="/profile" className="flex items-center px-3 mr-2 text-left rounded-lg shadow-md hover:scale-110 hover:bg-slate-200">
                <div className="flex justify-center mr-1">
                  <div className="flex items-center justify-center font-bold rounded-full w-7 h-7 ">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                  </div>
                </div>
                <span className="mr-2 text-lg text-gray-700 transition-colors duration-300 hover:text-primary">
                  Profile
                </span>
              </a>
              <button
                onClick={handleLogout}
                className="flex px-3 py-2 text-left rounded-lg shadow-md hover:scale-110 hover:bg-slate-200"
              >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mt-1 mr-1 size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
              </svg>
                Đăng xuất
              </button>
            </div>
          ) : (
            <a
              href="/login"
              className="flex px-3 py-2 text-left transition-colors duration-300 rounded-lg shadow-md hover:scale-110 text-text hover:text-primary hover:bg-slate-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mt-1 mr-1 size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
              </svg>
              Đăng nhập
            </a>
          )}
        </div>
      </div>


      {/* Mobile Menu */}
      <div className="md:hidden">
        <div
          className={`md:hidden fixed top-0 right-0 w-1/2 h-full bg-white transform p-3 transition-transform ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col space-y-2 justify-items-end">
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="text-primary focus:outline-none"
              >
                {/* Menu Icon for mobile */}
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              </button>
            </div>
            {isLoggedIn && role === "User" && (
              <>
                <div className="">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center w-full px-3 py-2 text-lg text-left text-gray-700 transition-colors duration-300 rounded-lg shadow-md hover:text-primary hover:bg-slate-200"
                  >
                    {ToolIcon}
                    Công cụ
                  </button>
                </div>
                
                <a
                  href="/convert"
                  className="flex items-center px-3 py-2 text-lg text-left text-gray-700 transition-colors duration-300 rounded-lg shadow-md hover:text-primary hover:bg-slate-200"
                >
                  <MdOutlineDocumentScanner className="mr-1 text-primary size-5"/>
                  Chuyển đổi OCR
                </a>
                
                <a
                  href="/editpdf"
                  className="flex items-center px-3 py-2 text-lg text-left text-gray-700 transition-colors duration-300 rounded-lg shadow-md hover:text-primary hover:bg-slate-200"
                >
                  {EditIcon}
                  Chỉnh sửa
                </a>
                
                <a
                  href="/chat"
                  className="flex items-center px-3 py-2 text-lg text-left text-gray-700 transition-colors duration-300 rounded-lg shadow-md hover:text-primary hover:bg-slate-200"
                >
                  {AIPDFIcon}
                  AI PDF
                </a>

                <a
                  href="/faq-user"
                  className="flex items-center px-3 py-2 text-lg text-left text-gray-700 transition-colors duration-300 rounded-lg shadow-md hover:text-primary hover:bg-slate-200"
                >
                  <FaQuestion className="ml-1 mr-2 text-primary"/>
                  FAQ
                </a>
              </>
            )}

            {isLoggedIn && role === "ADMIN" && (
              <div className="flex flex-col p-6 pt-6 space-y-3 bg-white">
                <a
                href="/admin-dashboard"
                className="flex items-center w-full px-3 py-2 text-lg text-left text-gray-700 transition-colors duration-300 rounded-lg shadow-md hover:text-primary hover:bg-slate-200"
              >
                <RiDashboard2Line className="mr-1 size-6"/>
                Dashboard
              </a>
              <a
                href="/admin/users"
                className="flex items-center w-full px-3 py-2 text-lg text-left text-gray-700 transition-colors duration-300 rounded-lg shadow-md hover:text-primary hover:bg-slate-200"
              >
                <FaUsersViewfinder className="mr-1 size-6"/>
                View Users
              </a>
              <a
                href="/faq-admin"
                className="flex items-center w-full px-3 py-2 text-lg text-left text-gray-700 transition-colors duration-300 rounded-lg shadow-md hover:text-primary hover:bg-slate-200"
              >
                <FaQuestion className="mr-1 size-6"/>
                Answer FAQs
              </a>
              </div>
            )}

            {isLoggedIn && role === "User" &&(
              <div className="flex flex-col p-6 space-y-3 bg-white">
                <a
                  href="#"
                  className="flex items-center w-full px-3 py-2 text-lg text-left text-gray-700 transition-colors duration-300 rounded-lg shadow-md hover:text-primary hover:bg-slate-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mr-1 size-6 ">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
                  </svg>
                  Tài khoản
                </a>
                <a
                  href="/service"
                  className="flex items-center w-full px-3 py-2 text-lg text-left text-gray-700 transition-colors duration-300 rounded-lg shadow-md hover:text-primary hover:bg-slate-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mr-1 size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
                  </svg>
                  Dịch vụ
                </a>
              </div>
            )}

            {isLoggedIn ? (
              <div className="flex flex-col p-6 space-y-3 bg-white">
                <a href="/profile" className="flex items-center w-full px-3 py-2 text-lg text-left text-gray-700 transition-colors duration-300 rounded-lg shadow-md hover:text-primary hover:bg-slate-200">
                  <div className="flex justify-center mr-1">
                    <div className="flex items-center justify-center font-bold rounded-full w-7 h-7">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    </div>
                  </div>
                  <span className="mr-2 text-lg text-gray-700 transition-colors duration-300 hover:text-primary">
                    Profile
                  </span>
                </a>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-lg text-left text-gray-700 transition-colors duration-300 rounded-lg shadow-md hover:text-primary hover:bg-slate-200"
                >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mt-1 mr-1 size-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                </svg>
                  Đăng xuất
                </button>
              </div>
            ) : (
              <a
                href="/login"
                className="flex items-center w-full px-3 py-2 text-lg text-left text-gray-700 transition-colors duration-300 rounded-lg shadow-md hover:text-primary hover:bg-slate-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mt-1 mr-1 size-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
                </svg>
                Đăng nhập
              </a>
            )}
          </div>
        </div>

        {/* Dropdown */}
        <div className="w-1/2">
          {isDropdownOpen && (
            <div
              className={`p-6 py-2 mt-2 bg-white border border-gray-200 shadow-lg'  ${
                isMobileMenuOpen ? "block" : "hidden"
              } `}
            >
              <ToolBar />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
