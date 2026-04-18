"use client"
import React, { useState } from 'react';
import Progress  from '@/components/progress';
import { CheckCircle, AlertCircle } from 'lucide-react';

const questions = [
  "Do you exercise regularly?",
  "Do you eat fruits and vegetables daily?",
  "Do you get at least 7-8 hours of sleep?",
  "Do you stay hydrated throughout the day?",
  "Do you avoid smoking and alcohol consumption?",
  "Do you manage stress effectively?",
  "Do you have regular medical check-ups?",
  "Do you maintain a healthy body weight?",
  "Do you limit sugar and junk food intake?",
  "Do you engage in mental exercises like reading or puzzles?",
];

export default function HealthQuiz() {
  const [answers, setAnswers] = useState(Array(10).fill(null));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(null);

  const handleAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (answers) => {
    const positiveCount = answers.filter(ans => ans === 'yes').length;
    const result = (positiveCount / questions.length) * 100;
    setScore(result);
  };

  const getResultMessage = () => {
    if (score >= 80) {
      return { message: 'You are in great health! Keep it up!', icon: <CheckCircle className="text-green-500" /> };
    } else if (score >= 50) {
      return { message: 'Your health is decent, but there’s room for improvement.', icon: <AlertCircle className="text-yellow-500" /> };
    } else {
      return { message: 'Consider making healthier choices for better well-being.', icon: <AlertCircle className="text-red-500" /> };
    }
  };

  return (
    <div className="min-h-screen  bg-gradient-to-br from-gray-100 to-gray-300 p-6 flex flex-col justify-center items-center">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-6 text-center">
        {score === null ? (
          <>
            <Progress value={((currentQuestion + 1) / questions.length) * 100} className="mb-4" />
            <h2 className="text-xl text-black uppercase font-semibold mb-6">{questions[currentQuestion]}</h2>
            <div className="flex justify-around">
              <button
                className="bg-green-500 text-white py-2 px-6 rounded-xl hover:bg-green-600 transition-all"
                onClick={() => handleAnswer('yes')}
              >Yes</button>
              <button
                className="bg-red-500 text-white py-2 px-6 rounded-xl hover:bg-red-600 transition-all"
                onClick={() => handleAnswer('no')}
              >No</button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center text-gray-800">
            {getResultMessage().icon}
            <h2 className="text-2xl font-bold mt-4 ">{getResultMessage().message}</h2>
            <p className="mt-2 text-lg">Your health score: {score.toFixed(2)}%</p>
            <button
              className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-all"
              onClick={() => { setAnswers(Array(10).fill(null)); setScore(null); setCurrentQuestion(0); }}
            >Retry Quiz</button>
          </div>
        )}
      </div>
    </div>
  );
}


