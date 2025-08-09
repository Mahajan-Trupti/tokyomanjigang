import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  addDoc,
} from "firebase/firestore";

import { auth, db } from "../firebase";

interface Mcq {
  question: string;
  options: { [key: string]: string };
  answer: string;
  explanation: string;
  difficulty: string;
  topic: string;
}

interface QuizResult {
  id: string;
  score: number;
  totalQuestions: number;
  mcqs: Mcq[];
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
}

//saving the quiz history and stuff

const saveMCQ = async (mcq: Mcq) => {
  const user = auth.currentUser;
  if (user && mcq.options) {
    try {
      const userMcqsRef = collection(db, "users", user.uid, "mcqs");
      await addDoc(userMcqsRef, {
        question: mcq.question,
        options: Object.values(mcq.options),
        correctAnswer: mcq.answer,
        createdAt: new Date(),
      });
    } catch (e) {
      console.error("Error adding MCQ document: ", e);
    }
  }
};

const saveQuizResult = async (
  score: number,
  totalQuestions: number,
  mcqs: Mcq[]
) => {
  const user = auth.currentUser;
  if (user) {
    try {
      const resultsRef = collection(db, "users", user.uid, "quizResults");
      await addDoc(resultsRef, {
        score,
        totalQuestions,
        mcqs,
        timestamp: new Date(),
      });
      console.log("Quiz result saved successfully!");
    } catch (e) {
      console.error("Error adding quiz result: ", e);
    }
  }
};

const getQuizHistory = async (userId: string): Promise<QuizResult[]> => {
  try {
    const q = query(
      collection(db, "users", userId, "quizResults"),
      orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(q);
    const quizHistory: any[] = [];
    querySnapshot.forEach((doc) => {
      quizHistory.push({ id: doc.id, ...doc.data() });
    });
    return quizHistory as QuizResult[];
  } catch (e) {
    console.error("Error fetching quiz history: ", e);
    return [];
  }
};

const QuizResultsPage = () => {
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [downloadableMcqs, setDownloadableMcqs] = useState<Mcq[]>([]);
  const [pastQuizzes, setPastQuizzes] = useState<QuizResult[]>([]);
  const [isAuthResolved, setIsAuthResolved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const storedScore = localStorage.getItem("quizScore");
      const storedTotalQuestions = localStorage.getItem("totalQuestions");
      const storedDownloadableMcqs = localStorage.getItem("downloadableMcqs");

      if (user) {
        if (storedScore && storedTotalQuestions && storedDownloadableMcqs) {
          const parsedScore = parseInt(storedScore, 10);
          const parsedTotalQuestions = parseInt(storedTotalQuestions, 10);
          const mcqs = JSON.parse(storedDownloadableMcqs);

          setScore(parsedScore);
          setTotalQuestions(parsedTotalQuestions);
          setDownloadableMcqs(mcqs);

          mcqs.forEach((mcq: Mcq) => saveMCQ(mcq));
          saveQuizResult(parsedScore, parsedTotalQuestions, mcqs);

          localStorage.removeItem("quizScore");
          localStorage.removeItem("totalQuestions");
          localStorage.removeItem("downloadableMcqs");
        }

        try {
          const history = await getQuizHistory(user.uid);
          setPastQuizzes(history);
        } catch (error) {
          console.error("Failed to fetch quiz history:", error);
        }
      } else {
        if (!storedScore) {
          navigate("/dashboard");
        }
      }
      setIsAuthResolved(true);
    });

    return () => unsubscribe();
  }, [navigate]);

  const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

  const getResultMessage = (percentage) => {
    if (percentage === 100) {
      return "Perfect Score! Excellent work!";
    } else if (percentage >= 80) {
      return "Great Job! You've got a solid understanding.";
    } else if (percentage >= 50) {
      return "Good Effort! Keep practicing to improve.";
    } else {
      return "Keep Learning! You'll get there with more practice.";
    }
  };

  const handleDownloadQuiz = (mcqs: Mcq[]) => {
    if (!mcqs || mcqs.length === 0) {
      console.warn("No MCQs to download.");
      return;
    }

    let content = "Generated Quiz:\n\n";
    mcqs.forEach((mcq, index) => {
      content += `Question ${index + 1}: ${mcq.question}\n`;
      content += `Options:\n`;
      if (mcq.options) {
        Object.entries(mcq.options).forEach(([key, value]) => {
          content += `  ${key}. ${value}\n`;
        });
      }
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
    URL.revokeObjectURL(url);
  };

  if (!isAuthResolved) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  const renderCurrentQuizResult = () => {
    if (!totalQuestions || totalQuestions === 0) {
      return (
        <div className="w-full max-w-lg p-8 rounded-2xl glow-border backdrop-blur-md bg-white/5 shadow-xl text-white text-center">
          <h2 className="text-3xl font-bold tracking-wider mb-6">
            Quiz Results
          </h2>
          <p className="text-lg mb-8 text-gray-300">
            No quiz data found. Please complete a quiz first.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="magic-button w-full px-6 py-3 rounded-xl text-lg font-medium text-white transition-all duration-300"
          >
            Go to Dashboard
          </button>
        </div>
      );
    }

    return (
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
            onClick={() => handleDownloadQuiz(downloadableMcqs)}
            className="magic-button w-full px-6 py-3 rounded-xl text-lg font-medium text-white transition-all duration-300 bg-blue-600 hover:bg-blue-700"
          >
            Download Quiz
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-8">
      {renderCurrentQuizResult()}

      {pastQuizzes.length > 0 && (
        <div className="w-full max-w-lg p-8 rounded-2xl glow-border backdrop-blur-md bg-white/5 shadow-xl text-white">
          <h2 className="text-3xl font-bold tracking-wider mb-6 text-center">
            Your Quiz History
          </h2>
          <ul className="space-y-4">
            {pastQuizzes.map((quiz, index) => (
              <li
                key={index}
                className="p-4 rounded-xl bg-white/5 border border-gray-700 hover:bg-white/10 transition-colors duration-200 flex justify-between items-center"
              >
                <div>
                  <p className="text-xl font-semibold">
                    Score: {quiz.score} / {quiz.totalQuestions}
                  </p>
                  <p className="text-sm text-gray-400">
                    Date:{" "}
                    {new Date(
                      quiz.timestamp.seconds * 1000
                    ).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-400">
                    Percentage:{" "}
                    {((quiz.score / quiz.totalQuestions) * 100).toFixed(0)}%
                  </p>
                </div>
                <button
                  onClick={() => handleDownloadQuiz(quiz.mcqs)}
                  className="magic-button px-4 py-2 rounded-xl text-sm font-medium text-white transition-all duration-300"
                >
                  Download MCQs
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default QuizResultsPage;
