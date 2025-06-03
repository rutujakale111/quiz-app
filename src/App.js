import React, { useState, useEffect } from "react";
import './App.css';

// Utility: shuffle array items
const shuffleArray = (arr) => {
  return arr
    .map((a) => [Math.random(), a])
    .sort((a, b) => a[0] - b[0])
    .map((a) => a[1]);
};

const questionsData = [
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Lisbon"],
    answer: "Paris",
  },
  {
    question: "Which programming language is used for web development?",
    options: ["Python", "C++", "JavaScript", "Swift"],
    answer: "JavaScript",
  },
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    answer: "4",
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    answer: "Mars",
  },
  {
    question: "Which company developed the iPhone?",
    options: ["Samsung", "Apple", "Google", "Microsoft"],
    answer: "Apple",
  },
  {
    question: "Which HTML tag is used to insert an image?",
    options: ["<img>", "<image>", "<src>", "<pic>"],
    answer: "<img>",
  },
  {
    question: "What does CSS stand for?",
    options: [
      "Computer Style Sheets",
      "Creative Style Sheets",
      "Cascading Style Sheets",
      "Colorful Style Sheets"
    ],
    answer: "Cascading Style Sheets",
  },
  {
    question: "What is the square root of 64?",
    options: ["6", "8", "10", "12"],
    answer: "8",
  },
  {
    question: "In which year was JavaScript created?",
    options: ["1995", "2000", "1985", "2010"],
    answer: "1995",
  },
  {
    question: "Who painted the Mona Lisa?",
    options: ["Vincent Van Gogh", "Leonardo da Vinci", "Picasso", "Michelangelo"],
    answer: "Leonardo da Vinci",
  },
];

function App() {
  // Shuffle questions once on start
  const [questions, setQuestions] = useState(() => shuffleArray(questionsData));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(() => {
    // Get score from localStorage or 0 if none
    const savedScore = localStorage.getItem("quizScore");
    return savedScore ? parseInt(savedScore, 10) : 0;
  });
  const [showScore, setShowScore] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15); // 15 seconds timer
  const [options, setOptions] = useState([]);

  // Shuffle options each time question changes
  useEffect(() => {
    if (questions.length > 0) {
      setOptions(shuffleArray(questions[currentQuestion].options));
    }
    setTimeLeft(15); // reset timer for new question
  }, [currentQuestion, questions]);

  // Timer countdown effect
  useEffect(() => {
    if (showScore) return; // stop timer if quiz ended

    if (timeLeft === 0) {
      // Time over, move to next question
      handleNextQuestion();
      return;
    }

    const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);

    return () => clearTimeout(timerId);
  }, [timeLeft, showScore]);

  const handleAnswerClick = (selectedOption) => {
    if (selectedOption === questions[currentQuestion].answer) {
      const newScore = score + 1;
      setScore(newScore);
      localStorage.setItem("quizScore", newScore);
    }
    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
      localStorage.removeItem("quizScore"); // Clear saved score on finish
    }
  };

  const handleRestart = () => {
    setScore(0);
    setCurrentQuestion(0);
    setShowScore(false);
    setQuestions(shuffleArray(questionsData));
    localStorage.removeItem("quizScore");
  };

  return (
    <div className="app">
      {showScore ? (
        <div className="score-section fade-in">
          <h2>Your Score: {score} / {questions.length}</h2>
          <button onClick={handleRestart}>Restart Quiz</button>
        </div>
      ) : (
        <div className="quiz-section fade-in">
          <div className="timer">Time Left: {timeLeft} sec</div>
          <h2>{questions[currentQuestion].question}</h2>
          <div className="options">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(option)}
                className="option-btn"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
