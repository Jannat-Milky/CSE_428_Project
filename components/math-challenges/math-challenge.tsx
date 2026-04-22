'use client';

import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

interface MathChallengeProps {
  challenge: any;
  onComplete: (results: any) => void;
}

export default function MathChallenge({ challenge, onComplete }: MathChallengeProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | string | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [answers, setAnswers] = useState<any[]>([]);

  const currentQuestion = challenge.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / challenge.questions.length) * 100;

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleTimeUp = () => {
    if (currentQuestionIndex < challenge.questions.length - 1) {
      handleNextQuestion(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleAnswerSelect = (answer: number | string) => {
    if (!answered) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null && selectedAnswer !== 0) return;

    const isCorrect = selectedAnswer === currentQuestion.answer || 
                      String(selectedAnswer) === String(currentQuestion.answer);

    if (isCorrect) {
      setScore(score + 1);
    }

    setAnswers([
      ...answers,
      {
        question: currentQuestion.question,
        userAnswer: selectedAnswer,
        correctAnswer: currentQuestion.answer,
        isCorrect,
      },
    ]);

    setAnswered(true);
  };

  const handleNextQuestion = (submitted: boolean = true) => {
    if (!submitted && !answered) {
      // If not submitted, mark as skipped
      setAnswers([
        ...answers,
        {
          question: currentQuestion.question,
          userAnswer: null,
          correctAnswer: currentQuestion.answer,
          isCorrect: false,
        },
      ]);
    }

    if (currentQuestionIndex < challenge.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      // Challenge complete
      handleChallengeComplete();
    }
  };

  const handleChallengeComplete = () => {
    const results = {
      score,
      totalQuestions: challenge.questions.length,
      percentage: Math.round((score / challenge.questions.length) * 100),
      answers,
      challenge,
      timeSpent: 600 - timeLeft,
    };
    onComplete(results);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header with Timer */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">{challenge.title}</h2>
          <p className="text-gray-400 mt-1">Question {currentQuestionIndex + 1} of {challenge.questions.length}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 rounded-lg p-4 border border-orange-800/50">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-orange-400" />
            <span className="text-2xl font-bold text-white">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-400">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <div className="bg-[#1a1f2b] rounded-lg border border-gray-800 overflow-hidden">
        <div className="p-8">
          <h3 className="text-2xl font-bold text-white mb-8">{currentQuestion.question}</h3>

          {/* Answer Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {currentQuestion.options.map((option: any, index: number) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={answered}
                className={`p-4 rounded-lg border-2 transition-all font-semibold text-lg ${
                  selectedAnswer === option
                    ? 'border-purple-500 bg-purple-900/30 text-white'
                    : 'border-gray-700 bg-transparent hover:border-gray-600 text-gray-300'
                } ${answered ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}
                ${
                  answered && option === currentQuestion.answer
                    ? 'border-green-500 bg-green-900/30 text-green-300'
                    : ''
                }
                ${
                  answered && selectedAnswer === option && option !== currentQuestion.answer
                    ? 'border-red-500 bg-red-900/30 text-red-300'
                    : ''
                }
                `}
              >
                <div className="flex items-center gap-3">
                  <span>{option}</span>
                  {answered && option === currentQuestion.answer && (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  )}
                  {answered && selectedAnswer === option && option !== currentQuestion.answer && (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Feedback */}
          {answered && (
            <div className={`p-4 rounded-lg flex gap-3 ${
              selectedAnswer === currentQuestion.answer
                ? 'bg-green-900/20 border border-green-800/50'
                : 'bg-red-900/20 border border-red-800/50'
            }`}>
              {selectedAnswer === currentQuestion.answer ? (
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className={`font-semibold ${selectedAnswer === currentQuestion.answer ? 'text-green-300' : 'text-red-300'}`}>
                  {selectedAnswer === currentQuestion.answer ? 'Correct!' : 'Incorrect'}
                </p>
                {selectedAnswer !== currentQuestion.answer && (
                  <p className="text-sm text-red-300 mt-1">
                    The correct answer is: <strong>{currentQuestion.answer}</strong>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Score Display */}
      <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-6 border border-purple-800/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Current Score</p>
            <p className="text-3xl font-bold text-white">{score}/{challenge.questions.length}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Success Rate</p>
            <p className="text-3xl font-bold text-white">{Math.round((score / (currentQuestionIndex + 1 || 1)) * 100)}%</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        {!answered ? (
          <button 
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null && selectedAnswer !== 0}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-300"
          >
            Submit Answer
          </button>
        ) : (
          <>
            <button
              onClick={() => handleNextQuestion(true)}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold rounded-lg transition-all duration-300"
            >
              {currentQuestionIndex === challenge.questions.length - 1 ? 'Finish' : 'Next Question'}
            </button>
            {currentQuestionIndex < challenge.questions.length - 1 && (
              <button
                onClick={() => handleNextQuestion(false)}
                className="px-6 py-3 bg-transparent hover:bg-gray-800 text-gray-400 hover:text-white font-semibold rounded-lg border border-gray-700 transition-all duration-300"
              >
                Skip
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
