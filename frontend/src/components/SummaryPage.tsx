import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SummaryPage = () => {
  const [summary, setSummary] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // initil data fetch
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false); // quiz generation
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const { pdfFile, quizParams } = location.state || {};

  useEffect(() => {
    const fetchSummaryAndKeywords = async () => {
      // useing the file from the navigation state
      if (!pdfFile) {
        setErrorMessage("No file uploaded. Please go back to the dashboard.");
        return;
      }

      setIsLoading(true);
      try {
        const formData = new FormData();
        formData.append("pdf_file", pdfFile, pdfFile.name);

        const response = await fetch(
          "http://127.0.0.1:5000/extract_topics_and_summary",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Failed to get summary and keywords."
          );
        }

        const data = await response.json();
        setSummary(data.summary);
        setKeywords(data.keywords);
      } catch (error) {
        console.error("Error fetching summary:", error);
        setErrorMessage(
          error.message || "Failed to get summary. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummaryAndKeywords();
  }, [navigate, pdfFile]);

  const handleProceedWithQuiz = async () => {
    setIsGeneratingQuiz(true);
    setErrorMessage("");

    if (!pdfFile || !quizParams) {
      setErrorMessage("Quiz parameters or file not found.");
      setIsGeneratingQuiz(false);
      return;
    }

    const formData = new FormData();
    formData.append("pdf_file", pdfFile);
    formData.append("difficulty", quizParams.difficulty);
    formData.append("numQuestions", quizParams.numQuestions);
    formData.append("topics", "[]"); // empty array if the user doesnt choose anything

    try {
      const response = await fetch("http://127.0.0.1:5000/generate_quiz", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Something went wrong on the server."
        );
      }

      const data = await response.json();
      localStorage.setItem("generatedMcqs", JSON.stringify(data.mcqs));

      navigate("/quiz");
    } catch (error) {
      console.error("Error generating quiz:", error);
      setErrorMessage(
        error.message || "Failed to generate quiz. Please try again."
      );
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleChooseTopics = () => {
    // passing file and quiz parameters to the topics page
    navigate("/topics", { state: { pdfFile, quizParams } });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white text-xl">
        Loading summary and keywords...
      </div>
    );
  }

  if (isGeneratingQuiz) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white text-xl">
        Generating Quiz...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-2xl p-8 rounded-2xl glow-border backdrop-blur-md bg-white/5 shadow-xl text-white">
        <h2 className="text-3xl font-bold tracking-wider text-center mb-6">
          Summary
        </h2>
        {errorMessage && (
          <p className="text-red-500 text-sm mt-2 text-center mb-4">
            {errorMessage}
          </p>
        )}
        <p className="text-lg text-gray-300 mb-6">{summary}</p>

        <h3 className="text-2xl font-bold tracking-wider mb-4">Keywords</h3>
        <div className="flex flex-wrap gap-2 mb-8">
          {keywords.map((keyword, index) => (
            <span
              key={index}
              className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium"
            >
              {keyword}
            </span>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={handleProceedWithQuiz}
            className="magic-button w-full px-6 py-3 rounded-xl text-lg font-medium text-white transition-all duration-300"
            disabled={isLoading || isGeneratingQuiz}
          >
            Proceed with Quiz →
          </button>
          <button
            onClick={handleChooseTopics}
            className="magic-button w-full px-6 py-3 rounded-xl text-lg font-medium text-white transition-all duration-300 bg-gray-700 hover:bg-gray-600"
            disabled={isLoading || isGeneratingQuiz}
          >
            Choose Topics →
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;
