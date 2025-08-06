import React, { useState } from "react";
import { Upload, X, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const HomePage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [difficulty, setDifficulty] = useState("medium");
  const [numQuestions, setNumQuestions] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages
  const navigate = useNavigate(); // Initialize navigate hook

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setErrorMessage(""); // Clear any previous error messages
    }
  };

  const handleGenerateClick = async () => {
    if (!selectedFile) {
      setErrorMessage("Please upload a PDF file first.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(""); // to clear out previous errors

    const formData = new FormData();
    formData.append("pdf_file", selectedFile);
    formData.append("difficulty", difficulty);
    formData.append("numQuestions", numQuestions);

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
      console.log("Quiz generated successfully!", data.mcqs);

      // this is to store generated mcqs in a local storage
      localStorage.setItem("generatedMcqs", JSON.stringify(data.mcqs));
      navigate("/quiz"); //navigate to a new quiz pag
    } catch (error) {
      console.error("Error generating quiz:", error);
      setErrorMessage(
        error.message || "Failed to generate quiz. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-lg p-8 rounded-2xl glow-border backdrop-blur-md bg-white/5 shadow-xl">
        <h2 className="text-3xl font-bold tracking-wider text-center text-white mb-8">
          Create a Quiz
        </h2>

        {/* Upload PDF Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Upload your PDF
          </label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center justify-center w-full px-4 py-3 rounded-xl border-2 border-dashed border-primary/30 text-primary cursor-pointer hover:bg-white/5 transition-colors">
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
                className="p-2 rounded-full text-white bg-primary/20 hover:bg-primary/40 transition-colors"
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
            className="block text-sm font-medium text-muted-foreground mb-2"
            htmlFor="difficulty"
          >
            Select Difficulty
          </label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-transparent focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* number of questions */}
        <div className="mb-6">
          <label
            className="block text-sm font-medium text-muted-foreground mb-2"
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
            className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-transparent focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          />
        </div>

        {/* generate button */}
        <button
          onClick={handleGenerateClick}
          className="magic-button w-full px-6 py-3 rounded-xl text-lg font-medium text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!selectedFile || isLoading}
        >
          {isLoading ? "Generating..." : "Generate Quiz →"}
        </button>
      </div>
    </div>
  );
};

export default HomePage;
