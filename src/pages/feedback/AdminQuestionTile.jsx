import React, { useState } from "react";
import { FaTrash, FaChevronDown, FaChevronUp, FaSearch } from "react-icons/fa";

const AdminQuestionTile = ({ question, onAddAnswer, onDelete }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [answerText, setAnswerText] = useState("");

    const toggleAnswers = () => {
        setIsExpanded(!isExpanded);
    };

    const handleAddAnswer = () => {
        if (answerText.trim()) {
        onAddAnswer(question, answerText);
        setAnswerText("");
        }
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
            <button
                onClick={() => onDelete(question)}
                className="text-red-500 hover:text-red-700"
            >
                <FaTrash />
            </button>
            </div>
        </div>

        {isExpanded && (
            <div className="mt-4">
            {question.answers && question.answers.length > 0 ? (
                question.answers.map((answer, index) => (
                <div key={index} className="mb-2">
                    <p className="text-gray-700">{answer.answer}</p>
                    <p className="text-sm text-gray-500">
                    Answered on: {answer.answerTime}
                    </p>
                </div>
                ))
            ) : (
                <p className="text-gray-500">No answers yet</p>
            )}

            <div className="flex items-center justify-center mt-4 space-x-2 ">
                <input
                type="text"
                placeholder="Write an answer"
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                />
                <button
                onClick={handleAddAnswer}
                className="w-1/3 p-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                >
                Add Answer
                </button>
            </div>
            </div>
        )}
        </div>
    );
};

export default AdminQuestionTile;
