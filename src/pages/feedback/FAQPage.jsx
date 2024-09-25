import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaChevronDown, FaChevronUp, FaSearch } from "react-icons/fa";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";

const FAQPage = () => {
    const [questions, setQuestions] = useState([]);
    const [filteredQuestions, setFilteredQuestions] = useState([]);
    const [questionText, setQuestionText] = useState("");
    const [searchText, setSearchText] = useState("");
    const [currentUserID, setCurrentUserID] = useState("");
    const apiUrl = "http://103.145.63.232:8081/api";

    useEffect(() => {
        fetchQuestions();
        getCurrentUserID();
    }, []);

    useEffect(() => {
        handleSearch();
    }, [searchText, questions]);

    const getCurrentUserID = async () => {
        const userID = sessionStorage.getItem("userID");
        if (userID) {
        setCurrentUserID(userID);
        }
    };

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

    const addQuestion = async () => {
        try {
        const token = getAuthToken();
        if (!token) {
            throw new Error("No token found");
        }

        if (questionText.trim()) {
            const response = await axios.post(
            `${apiUrl}/questions`,
            { message: questionText },
            {
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                },
            }
            );

            if (response.status === 200) {
            fetchQuestions(); // Refresh the questions list
            setQuestionText("");
            } else {
            console.error("Failed to add question:", response.status);
            }
        }
        } catch (error) {
        console.error("Error adding question:", error);
        }
    };

    const editQuestion = async (question) => {
        const newMessage = prompt("Edit your question", question.message);
        if (newMessage !== null && newMessage !== question.message) {
        try {
            const token = getAuthToken();
            if (!token) {
            throw new Error("No token found");
            }

            const response = await axios.put(
            `${apiUrl}/questions/${question.messageID}`,
            { message: newMessage },
            {
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                },
            }
            );

            if (response.status === 200) {
            fetchQuestions();
            } else {
            console.error("Failed to update question:", response.status);
            }
        } catch (error) {
            console.error("Error editing question:", error);
        }
        }
    };

    const deleteQuestion = async (question) => {
        if (window.confirm("Are you sure you want to delete this question?")) {
        try {
            const token = getAuthToken();
            if (!token) {
            throw new Error("No token found");
            }

            const response = await axios.delete(
            `${apiUrl}/questions/${question.messageID}`,
            {
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                },
            }
            );

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
        <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow w-full max-w-4xl min-h-screen p-6 mx-auto">
            <h1 className="mt-16 mb-6 text-3xl font-bold text-center">Q&A</h1>
            <div className="flex flex-col items-center mb-6 space-y-4">
            <div className="flex items-start justify-center w-full max-w-sm">
                <FaSearch className="mr-2 text-gray-500 size-9" />
                <input
                    type="text"
                    placeholder="Search questions..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-auto p-2 border border-gray-300 rounded-lg"
                />
            </div>
            <div className="flex items-start justify-center w-full space-x-3">
                <input
                    type="text"
                    placeholder="Ask a new question..."
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                />
                <button
                    onClick={addQuestion}
                    className="w-1/5 max-w-sm p-2 text-white bg-blue-500 rounded-lg"
                >
                    Add Question
                </button>
            </div>    
            </div>
            <ul className="space-y-4">
            {filteredQuestions.map((question) => (
                <QuestionTile
                key={question.messageID}
                question={question}
                isOwner={question.userID.toString() === currentUserID}
                onEdit={editQuestion}
                onDelete={deleteQuestion}
                />
            ))}
            </ul>
        </div>
        <Footer />
        </div>
    );
    };

    const QuestionTile = ({ question, isOwner, onEdit, onDelete }) => {
        const [isExpanded, setIsExpanded] = useState(false);

        const toggleAnswers = () => {
            setIsExpanded(!isExpanded);
        };
    return (
        <div className="p-4 bg-white border border-gray-300 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{question.message}</h3>
            <div className="flex items-center space-x-2">
            <button
                onClick={toggleAnswers}
                className="text-gray-500 hover:text-gray-700"
            >
                {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {isOwner && (
                <>
                <button
                    onClick={() => onEdit(question)}
                    className="text-blue-500 hover:text-blue-700"
                >
                    <FaEdit />
                </button>
                <button
                    onClick={() => onDelete(question)}
                    className="text-red-500 hover:text-red-700"
                >
                    <FaTrash />
                </button>
                </>
            )}
            </div>
        </div>
        {isExpanded && question.answers && question.answers.length > 0 && (
            <div className="mt-4">
            {question.answers.map((answer, index) => (
                <div key={index} className="mb-2">
                <p className="text-gray-700">{answer.answer}</p>
                <p className="text-sm text-gray-500">
                    Answered on: {answer.answerTime}
                </p>
                </div>
            ))}
            </div>
        )}
        {isExpanded && question.answers && question.answers.length === 0 && (
            <p className="mt-4 text-gray-500">No answers yet</p>
        )}
        </div>
    );
};

export default FAQPage;
