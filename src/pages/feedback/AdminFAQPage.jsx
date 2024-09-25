import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminQuestionTile from './AdminQuestionTile';
import { FaSearch } from "react-icons/fa";
import Header from "../../layout/Header"; // Adjust the path according to your project structure

const AdminFAQPage = () => {
    const [questions, setQuestions] = useState([]);
    const [filteredQuestions, setFilteredQuestions] = useState([]);
    const [searchText, setSearchText] = useState("");
    const apiUrl = "http://localhost:8081/api";

    useEffect(() => {
        fetchQuestions();
    }, []);

    useEffect(() => {
        handleSearch();
    }, [searchText, questions]);

    const getAuthToken = () => {
        return sessionStorage.getItem("authToken");
    };

    const fetchQuestions = async () => {
        try {
        const token = getAuthToken();
        if (!token) {
            throw new Error("No token found");
        }

        const response = await axios.get(`${apiUrl}/questions/all-with-answers`, {
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            setQuestions(response.data);
            setFilteredQuestions(response.data);
        } else {
            console.error("Failed to load questions:", response.status);
        }
        } catch (error) {
        console.error("Error fetching questions:", error);
        }
    };

    const addAnswer = async (question, answerText) => {
        try {
        const token = getAuthToken();
        if (!token) {
            throw new Error("No token found");
        }

        if (answerText.trim()) {
            const response = await axios.post(
            `${apiUrl}/answers/question/${question.messageID}`,
            { answer: answerText },
            {
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                },
            }
            );

            if (response.status === 200) {
            fetchQuestions(); // Refresh the questions list
            } else {
            console.error("Failed to add answer:", response.status);
            }
        }
        } catch (error) {
        console.error("Error adding answer:", error);
        }
    };

    const deleteQuestion = async (question) => {
        if (window.confirm("Are you sure you want to delete this question?")) {
        try {
            const token = getAuthToken();
            if (!token) {
            throw new Error("No token found");
            }

            const response = await axios.delete(`${apiUrl}/questions/${question.messageID}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            });

            if (response.status === 200 || response.status === 204) {
            setQuestions((prevQuestions) =>
                prevQuestions.filter((q) => q.messageID !== question.messageID)
            );
            } else {
            console.error("Failed to delete question:", response.status);
            }
        } catch (error) {
            console.error("Error deleting question:", error);
        }
        }
    };

    const handleSearch = () => {
        if (searchText.trim()) {
        const filtered = questions.filter((question) =>
            question.message.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredQuestions(filtered);
        } else {
        setFilteredQuestions(questions);
        }
    };

    return (
        <>
        <Header />
        <div className="flex flex-col items-center justify-center max-w-4xl p-6 mx-auto">
            <h1 className="mt-16 mb-6 text-3xl font-bold text-center">Admin Q&A</h1>
            <div className="flex items-center justify-center w-1/2 mb-6">
                <FaSearch className="mr-3 text-gray-500 size-9" />
                <input
                    type="text"
                    placeholder="Search questions..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                />
            </div>
            <ul className="w-full space-y-4">
            {filteredQuestions.map((question) => (
                <AdminQuestionTile
                key={question.messageID}
                question={question}
                onAddAnswer={addAnswer}
                onDelete={deleteQuestion}
                />
            ))}
            </ul>
        </div>
        </>
    );
};

export default AdminFAQPage;
