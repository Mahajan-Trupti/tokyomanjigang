import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const QuizResultsPage = () => {
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [downloadableMcqs, setDownloadableMcqs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedScore = localStorage.getItem("quizScore");
    const storedTotalQuestions = localStorage.getItem("totalQuestions");
    const storedDownloadableMcqs = localStorage.getItem("downloadableMcqs");

    if (storedScore && storedTotalQuestions && storedDownloadableMcqs) {
      setScore(parseInt(storedScore, 10));
      setTotalQuestions(parseInt(storedTotalQuestions, 10));
      try {
        setDownloadableMcqs(JSON.parse(storedDownloadableMcqs));
      } catch (e) {
        console.error(
          "Failed to parse downloadable MCQs from localStorage:",
          e
        );
        setDownloadableMcqs([]);
      }
    } else {
      // If no score data, redirect to dashboard
      navigate("/dashboard");
    }

    // Clean up localStorage after fetching results
    return () => {
      localStorage.removeItem("quizScore");
      localStorage.removeItem("totalQuestions");
      localStorage.removeItem("downloadableMcqs");
    };
  }, [navigate]);

  const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

  const getResultMessage = (percentage) => {
    if (percentage === 100) {
      return "Perfect Score! 🎉 Excellent work!";
    } else if (percentage >= 80) {
      return "Great Job! 👍 You've got a solid understanding.";
    } else if (percentage >= 50) {
      return "Good Effort! Keep practicing to improve. 💪";
    } else {
      return "Keep Learning! You'll get there with more practice";
    }
  };

  const handleDownloadQuiz = () => {
    if (downloadableMcqs.length === 0) {
      console.warn("No MCQs to download.");
      return;
    }

    let content = "Generated Quiz:\n\n";
    downloadableMcqs.forEach((mcq, index) => {
      content += `Question ${index + 1}: ${mcq.question}\n`;
      content += `Options:\n`;
      Object.entries(mcq.options).forEach(([key, value]) => {
        content += `  ${key}. ${value}\n`;
      });
      content += `Answer: ${mcq.answer}\n`;
      content += `Explanation: ${mcq.explanation}\n`;
      content += `Difficulty: ${mcq.difficulty}\n`;
      content += `Topic: ${mcq.topic}\n\n`;
      content += "----------------------------------------\n\n";
    });

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "generated_quiz.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up the URL object
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-lg p-8 rounded-2xl glow-border backdrop-blur-md bg-white/5 shadow-xl text-white text-center">
        <h2 className="text-3xl font-bold tracking-wider mb-6">Quiz Results</h2>
        <p className="text-6xl font-extrabold text-primary mb-4">
          {score} / {totalQuestions}
        </p>
        <p className="text-2xl font-semibold mb-8">
          {percentage.toFixed(0)}% Correct!
        </p>
        <p className="text-lg mb-8 text-gray-300">
          {getResultMessage(percentage)}
        </p>

        <div className="space-y-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="magic-button w-full px-6 py-3 rounded-xl text-lg font-medium text-white transition-all duration-300"
          >
            Generate Another Quiz →
          </button>
          <button
            onClick={handleDownloadQuiz}
            className="magic-button w-full px-6 py-3 rounded-xl text-lg font-medium text-white transition-all duration-300 bg-blue-600 hover:bg-blue-700"
          >
            Download Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResultsPage;
