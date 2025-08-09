import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const TopicSelectionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [topics, setTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // initial data fetch
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false); // quiz generation
  const [errorMessage, setErrorMessage] = useState("");

  const { pdfFile, quizParams } = location.state || {};

  useEffect(() => {
    const fetchTopics = async () => {
      if (!pdfFile) {
        setErrorMessage("No file uploaded. Please go back to the dashboard.");
        return;
      }

      setIsLoading(true);
      try {
        const formData = new FormData();
        formData.append("pdf_file", pdfFile, pdfFile.name);

        const response = await fetch("http://127.0.0.1:5000/extract_topics", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Failed to extract topics from the PDF."
          );
        }

        const data = await response.json();
        setTopics(
          data.topics.map((topic, index) => ({
            id: `topic${index + 1}`,
            name: topic,
          }))
        );
      } catch (error) {
        console.error("Error fetching topics:", error);
        setErrorMessage(
          error.message || "Failed to load topics. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopics();
  }, [navigate, pdfFile]);

  const handleTopicClick = (topicId) => {
    setSelectedTopics((prevSelected) => {
      if (prevSelected.includes(topicId)) {
        return prevSelected.filter((id) => id !== topicId);
      } else {
        return [...prevSelected, topicId];
      }
    });
  };

  const handleGenerateClick = async () => {
    if (selectedTopics.length === 0) {
      setErrorMessage("Please select at least one topic.");
      return;
    }
    setIsGeneratingQuiz(true);
    setErrorMessage("");

    if (!quizParams || !pdfFile) {
      setErrorMessage("Quiz parameters or file not found.");
      setIsGeneratingQuiz(false);
      return;
    }

    const formData = new FormData();
    formData.append("pdf_file", pdfFile, pdfFile.name);
    formData.append("difficulty", quizParams.difficulty);
    formData.append("numQuestions", quizParams.numQuestions);
    const selectedTopicNames = topics
      .filter((topic) => selectedTopics.includes(topic.id))
      .map((topic) => topic.name);
    formData.append("topics", JSON.stringify(selectedTopicNames));

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white text-xl">
        Loading topics...
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
      <div className="w-full max-w-2xl p-8 rounded-2xl glow-border backdrop-blur-md bg-white/5 shadow-xl">
        <h2 className="text-3xl font-bold tracking-wider text-center text-white mb-8">
          Select Topics
        </h2>
        {errorMessage && (
          <p className="text-red-500 text-sm mt-2 text-center">
            {errorMessage}
          </p>
        )}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => handleTopicClick(topic.id)}
              className={`py-2 px-6 rounded-full font-medium transition-colors duration-300
                ${
                  selectedTopics.includes(topic.id)
                    ? "bg-green-500 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
            >
              {topic.name}
            </button>
          ))}
        </div>
        <div className="text-center mt-8">
          <button
            onClick={handleGenerateClick}
            disabled={
              selectedTopics.length === 0 || isLoading || isGeneratingQuiz
            }
            className="magic-button px-8 py-4 rounded-xl text-xl font-medium text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingQuiz ? "Generating Quiz..." : "Generate Quiz →"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopicSelectionPage;
