import React, { useState } from "react";
import { Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GridDistortion from "./GridDistortion";

const HomePage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [difficulty, setDifficulty] = useState("medium");
  const [numQuestions, setNumQuestions] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setErrorMessage("");
    }
  };

  const showMessage = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(""), 5000);
  };

  const handleDirectGenerate = async () => {
    if (!selectedFile) {
      showMessage("Please upload a PDF file first.");
      return;
    }
    setIsLoading(true);
    setErrorMessage("");

    const formData = new FormData();
    formData.append("pdf_file", selectedFile);
    formData.append("difficulty", difficulty);
    formData.append("numQuestions", numQuestions);

    try {
      const response = await fetch("http://127.0.0.1:5000/generate_quiz", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Something went wrong on the server.");
      }

      console.log("Quiz generated successfully!", data.mcqs);
      localStorage.setItem("generatedMcqs", JSON.stringify(data.mcqs));
      navigate("/quiz");
    } catch (error) {
      console.error("Error generating quiz:", error);
      showMessage(
        error.message || "Failed to generate quiz. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleTopicsSelection = () => {
    if (!selectedFile) {
      showMessage("Please upload a PDF file first.");
      return;
    }

    //file and quiz parameeters
    navigate("/topics", {
      state: {
        pdfFile: selectedFile,
        quizParams: { difficulty, numQuestions },
      },
    });
  };

  const handleSummarySelection = () => {
    if (!selectedFile) {
      showMessage("Please upload a PDF file first.");
      return;
    }
    //file and quiz parameters
    navigate("/summary", {
      state: {
        pdfFile: selectedFile,
        quizParams: { difficulty, numQuestions },
      },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative text-white overflow-hidden">
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <GridDistortion
          imageSrc="https://i.pinimg.com/736x/7c/61/40/7c61406369bffe8bc8d339d83ab1dd81.jpg"
          grid={10}
          mouse={0.1}
          strength={0.15}
          relaxation={0.9}
          className="custom-class"
        />
      </div>
      <div className="relative z-10 w-full max-w-lg p-8 rounded-2xl glow-border backdrop-blur-md bg-white/5 shadow-xl">
        <h2 className="text-3xl font-bold tracking-wider text-center mb-8">
          Create a Quiz
        </h2>
        {/* upload pdf*/}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Upload your PDF
          </label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center justify-center w-full px-4 py-3 rounded-xl border-2 border-dashed border-sky-400/30 text-sky-400 cursor-pointer hover:bg-white/5 transition-colors">
              <Upload className="mr-2" size={20} />
              <span className="text-sm font-medium">
                {selectedFile ? selectedFile.name : "Choose a file"}
              </span>
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            {selectedFile && (
              <button
                onClick={() => setSelectedFile(null)}
                className="p-2 rounded-full text-white bg-sky-400/20 hover:bg-sky-400/40 transition-colors"
                aria-label="Remove file"
              >
                <X size={16} />
              </button>
            )}
          </div>
          {errorMessage && (
            <p className="text-red-500 text-sm mt-2 text-center">
              {errorMessage}
            </p>
          )}
        </div>

        {/* to select difficulty */}
        <div className="mb-6">
          <label
            className="block text-sm font-medium text-gray-400 mb-2"
            htmlFor="difficulty"
          >
            Select Difficulty
          </label>
          <div className="flex justify-between gap-4">
            {["easy", "medium", "hard"].map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`w-full px-4 py-3 rounded-full font-medium transition-colors duration-300
                  ${
                    difficulty === level
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* number of questions */}
        <div className="mb-6">
          <label
            className="block text-sm font-medium text-gray-400 mb-2"
            htmlFor="numQuestions"
          >
            Number of Questions
          </label>
          <input
            id="numQuestions"
            type="number"
            value={numQuestions}
            onChange={(e) => setNumQuestions(e.target.value)}
            min="1"
            max="20"
            className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-transparent focus:outline-none focus:ring-2 focus:ring-sky-400 transition-colors"
          />
        </div>

        {/* generate button */}
        <div className="space-y-4">
          <button
            onClick={handleDirectGenerate}
            className="magic-button w-full px-6 py-3 rounded-xl text-lg font-medium text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedFile || isLoading}
          >
            {isLoading ? "Generating..." : "Generate Instant Quiz →"}
          </button>
          <button
            onClick={handleTopicsSelection}
            className="magic-button w-full px-6 py-3 rounded-xl text-lg font-medium text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedFile || isLoading}
          >
            Choose Topics →
          </button>
          <button
            onClick={handleSummarySelection}
            className="magic-button w-full px-6 py-3 rounded-xl text-lg font-medium text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedFile || isLoading}
          >
            Revise with Summary →
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
