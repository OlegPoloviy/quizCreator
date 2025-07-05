"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import QuizHeader from "@/components/quizzes/QuizHeader";
import QuestionCard from "@/components/quizzes/QuestionCard";
import QuizProgress from "@/components/quizzes/QuizProgress";
import QuizResults from "@/components/quizzes/QuizResults";
import { quizService } from "../../lib/quiz.service";
import { Quiz, Question } from "@/types/Quiz.types";

export default function IndividualQuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedQuiz = await quizService.getQuizById(quizId);
        setQuiz(fetchedQuiz);
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setError("Failed to load quiz. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  const handleStartQuiz = () => {
    setIsStarted(true);
  };

  const handleAnswerChange = (questionId: string, answer: any) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      // Here you would submit the quiz answers to your API
      console.log("Quiz answers:", userAnswers);
      // await quizService.submitQuizAnswers(quizId, userAnswers);

      // Show results instead of navigating away
      setIsCompleted(true);
    } catch (err) {
      console.error("Error submitting quiz:", err);
      alert("Error submitting quiz. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetakeQuiz = () => {
    setIsCompleted(false);
    setIsStarted(false);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
  };

  const getAnsweredQuestionsCount = () => {
    return Object.keys(userAnswers).length;
  };

  const isQuestionAnswered = (questionId: string) => {
    return (
      userAnswers[questionId] !== undefined &&
      userAnswers[questionId] !== null &&
      userAnswers[questionId] !== ""
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-6">
              <div className="h-32 bg-gray-200 rounded-lg"></div>
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {error || "Quiz not found"}
            </h2>
            <p className="text-gray-600 mb-6">
              {error ||
                "The quiz you're looking for doesn't exist or has been removed."}
            </p>
            <Button onClick={() => router.push("/quizzes")}>
              Back to Quizzes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const answeredQuestions = getAnsweredQuestionsCount();
  const canGoPrevious = currentQuestionIndex > 0;
  const canGoNext = currentQuestionIndex < quiz.questions.length - 1;
  const canFinish = currentQuestionIndex === quiz.questions.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Quiz Header */}
        <div className="mb-8">
          <QuizHeader
            quiz={quiz}
            onStartQuiz={handleStartQuiz}
            isStarted={isStarted}
          />
        </div>

        {isStarted && !isCompleted && (
          <>
            {/* Progress Bar */}
            <div className="mb-6">
              <QuizProgress
                currentQuestion={currentQuestionIndex + 1}
                totalQuestions={quiz.questions.length}
                answeredQuestions={answeredQuestions}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onFinish={handleFinish}
                canGoPrevious={canGoPrevious}
                canGoNext={canGoNext}
                canFinish={canFinish}
              />
            </div>

            {/* Current Question */}
            <div className="mb-8">
              <QuestionCard
                question={currentQuestion}
                questionNumber={currentQuestionIndex + 1}
                onAnswerChange={handleAnswerChange}
                userAnswer={userAnswers[currentQuestion.id]}
                isAnswered={isQuestionAnswered(currentQuestion.id)}
              />
            </div>

            {/* Submit Button */}
            {canFinish && (
              <div className="flex justify-center">
                <Button
                  size="lg"
                  onClick={handleFinish}
                  disabled={isSubmitting || answeredQuestions === 0}
                  className="text-lg px-8 py-6"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Quiz"
                  )}
                </Button>
              </div>
            )}
          </>
        )}

        {/* Quiz Results */}
        {isCompleted && (
          <QuizResults
            quiz={quiz}
            userAnswers={userAnswers}
            onRetakeQuiz={handleRetakeQuiz}
          />
        )}
      </div>
    </div>
  );
}
