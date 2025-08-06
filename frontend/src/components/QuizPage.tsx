import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const QuizPage = () => {
  const [mcqs, setMcqs] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const navigate = useNavigate();

  // parsing function
  const parseMcqString = (mcqString) => {
    const questionMatch = mcqString.match(/Question:\s*(.*?)\s*Options:/s);
    const optionsMatch = mcqString.match(
      /Options:\s*A\.\s*(.*?)\s*B\.\s*(.*?)\s*C\.\s*(.*?)\s*D\.\s*(.*?)(?=\s*Answer:|\s*$)/s
    );
    const answerMatch = mcqString.match(/Answer:\s*([A-D])/s);
    const explanationMatch = mcqString.match(
      /Explanation:\s*(.*?)(?=\s*Difficulty:|\s*$)/s
    );
    const difficultyMatch = mcqString.match(
      /Difficulty:\s*(.*?)(?=\s*Topic:|\s*$)/s
    );
    const topicMatch = mcqString.match(/Topic:\s*(.*)/s);

    return {
      question: questionMatch ? questionMatch[1].trim() : "N/A",
      options: optionsMatch
        ? {
            A: optionsMatch[1].trim(),
            B: optionsMatch[2].trim(),
            C: optionsMatch[3].trim(),
            D: optionsMatch[4].trim(),
          }
        : { A: "N/A", B: "N/A", C: "N/A", D: "N/A" },
      answer: answerMatch ? answerMatch[1].trim() : "N/A",
      explanation: explanationMatch ? explanationMatch[1].trim() : "N/A",
      difficulty: difficultyMatch ? difficultyMatch[1].trim() : "N/A",
      topic: topicMatch ? topicMatch[1].trim() : "N/A",
    };
  };

  useEffect(() => {
    const storedMcqs = localStorage.getItem("generatedMcqs");
    if (storedMcqs) {
      try {
        const rawMcqs = JSON.parse(storedMcqs);
        const parsedMcqs = rawMcqs.map(parseMcqString);
        setMcqs(parsedMcqs);
        // load the answers
        const storedUserAnswers = localStorage.getItem("userAnswers");
        if (storedUserAnswers) {
          setUserAnswers(JSON.parse(storedUserAnswers));
        }
      } catch (e) {
        console.error("Failed to parse MCQs from localStorage:", e);
        setMcqs([]);
      }
    } else {
      navigate("/dashboard");
    }
  }, [navigate]);

  useEffect(() => {
    setSelectedOption(userAnswers[currentQuestionIndex] || null);
    setShowAnswer(userAnswers[currentQuestionIndex] !== undefined);
  }, [currentQuestionIndex, userAnswers]);

  const handleOptionClick = (optionKey) => {
    if (selectedOption === null) {
      setSelectedOption(optionKey);
      setShowAnswer(true);
      setUserAnswers((prevAnswers) => ({
        ...prevAnswers,
        [currentQuestionIndex]: optionKey,
      }));
    }
  };

  const calculateScore = () => {
    let score = 0;
    mcqs.forEach((mcq, index) => {
      if (userAnswers[index] === mcq.answer) {
        score++;
      }
    });
    return score;
  };

  const handleNext = () => {
    if (currentQuestionIndex === mcqs.length - 1) {
      //quiz end
      const score = calculateScore();
      localStorage.setItem("quizScore", score.toString());
      localStorage.setItem("totalQuestions", mcqs.length.toString());
      localStorage.setItem("downloadableMcqs", JSON.stringify(mcqs)); // store for download
      localStorage.removeItem("generatedMcqs");
      localStorage.removeItem("userAnswers"); //clearing memory
      navigate("/quiz-results");
    } else {
      setCurrentQuestionIndex((prevIndex) =>
        Math.min(prevIndex + 1, mcqs.length - 1)
      );
    }
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  if (mcqs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-white">
        <div className="text-xl font-semibold">
          No quiz questions to display.
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-4 px-6 py-3 rounded-xl text-lg font-medium text-white bg-primary/20 hover:bg-primary/40 transition-colors"
        >
          Go Back to Quiz Creator
        </button>
      </div>
    );
  }

  const currentMcq = mcqs[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === mcqs.length - 1;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "hard":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getOptionClasses = (optionKey) => {
    let classes = "p-3 rounded-lg border border-gray-700 transition-colors ";
    const hasAnswered = userAnswers[currentQuestionIndex] !== undefined;

    if (!hasAnswered) {
      classes += "hover:bg-gray-700 cursor-pointer";
    } else {
      classes += "cursor-default";

      if (optionKey === userAnswers[currentQuestionIndex]) {
        if (optionKey === currentMcq.answer) {
          classes += " bg-green-700 border-green-500";
        } else {
          classes += " bg-red-700 border-red-500";
        }
      } else if (optionKey === currentMcq.answer) {
        classes += " bg-green-700 border-green-500";
      }
    }
    return classes;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-2xl p-8 rounded-2xl glow-border backdrop-blur-md bg-white/5 shadow-xl">
        <h2 className="text-3xl font-bold tracking-wider text-center text-white mb-8">
          Your Generated Quiz
        </h2>

        {currentMcq && (
          <div className="mb-8 p-6 rounded-xl bg-gray-800/70 shadow-lg text-white">
            <div className="flex justify-between items-center mb-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(
                  currentMcq.difficulty
                )}`}
              >
                {currentMcq.difficulty}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-500">
                {currentMcq.topic}
              </span>
            </div>
            <p className="text-xl font-semibold mb-4">{`Question ${
              currentQuestionIndex + 1
            }: ${currentMcq.question}`}</p>
            <div className="space-y-3">
              {Object.entries(currentMcq.options).map(([key, value]) => (
                <div
                  key={key}
                  className={getOptionClasses(key)}
                  onClick={() => handleOptionClick(key)}
                >
                  <span className="font-medium">{`${key}. `}</span>
                  {value}
                </div>
              ))}
            </div>
            {showAnswer && (
              <div className="mt-6 border-t border-gray-700 pt-4">
                <p className="text-lg font-semibold text-primary">
                  Answer: {currentMcq.answer}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Explanation: {currentMcq.explanation}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="magic-button px-6 py-3 rounded-xl text-lg font-medium text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          <span className="text-white text-lg font-medium self-center">
            {`${currentQuestionIndex + 1} / ${mcqs.length}`}
          </span>
          <button
            onClick={handleNext}
            className="magic-button px-6 py-3 rounded-xl text-lg font-medium text-white transition-all duration-300"
          >
            {isLastQuestion ? "End Quiz" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
