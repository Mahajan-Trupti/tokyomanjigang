// src/services/database.ts

import { collection, query, where, getDocs, orderBy, addDoc } from 'firebase/firestore';
import { auth, db } from "../firebase";

/**
 * Saves a new MCQ for the currently logged-in user.
 * @param {string} question - The question text.
 * @param {string[]} options - An array of possible answers.
 * @param {string} correctAnswer - The correct answer.
 */
export async function saveMCQ(question, options, correctAnswer) {
    const user = auth.currentUser;
    if (user) {
        try {
            const userMcqsRef = collection(db, "users", user.uid, "mcqs");
            const docRef = await addDoc(userMcqsRef, {
                question: question,
                options: options,
                correctAnswer: correctAnswer,
                createdAt: new Date(),
            });
            console.log("MCQ saved with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    } else {
        console.error("No user is signed in. Cannot save MCQ.");
    }
}

export const getQuizHistory = async (userId) => {
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
        return quizHistory;
    } catch (e) {
        console.error("Error fetching quiz history: ", e);
        return [];
    }
};

/**
 * Saves the quiz result for the currently logged-in user, including MCQs.
 * @param {number} score - The user's score.
 * @param {number} totalQuestions - The total number of questions.
 * @param {object[]} mcqs - The array of MCQs for the quiz.
 */
export async function saveQuizResult(score, totalQuestions, mcqs) {
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
    } else {
        console.error("No user is signed in. Cannot save quiz result.");
    }
}