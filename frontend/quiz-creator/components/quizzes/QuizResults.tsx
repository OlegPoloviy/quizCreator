import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Clock,
  CheckCircle,
  XCircle,
  Home,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";

interface QuizResultsProps {
  quiz: {
    id: string;
    title: string;
    questions: any[];
  };
  userAnswers: Record<string, any>;
  onRetakeQuiz: () => void;
  result?: any;
}

export default function QuizResults({
  quiz,
  userAnswers,
  onRetakeQuiz,
  result,
}: QuizResultsProps) {
  const answeredQuestions = Object.keys(userAnswers).length;
  const totalQuestions = quiz.questions.length;
  const completionPercentage = Math.round(
    (answeredQuestions / totalQuestions) * 100
  );

  const score = result?.score ?? completionPercentage;
  const startedAt = result?.startedAt;
  const completedAt = result?.completedAt;
  const backendAnswers = result?.answers;

  const completionRate = result?.score ?? completionPercentage;
  const answeredCount = backendAnswers
    ? backendAnswers.length
    : answeredQuestions;

  const getCompletionMessage = () => {
    if (score === 100) {
      return "Perfect! You completed all questions.";
    } else if (score >= 80) {
      return "Great job! You answered most questions.";
    } else if (score >= 60) {
      return "Good effort! You answered many questions.";
    } else {
      return "You answered some questions. Consider reviewing the quiz.";
    }
  };

  const getCompletionColor = () => {
    if (score === 100) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-blue-50">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Trophy className="w-16 h-16 text-yellow-500" />
                <CheckCircle className="w-8 h-8 text-green-600 absolute -bottom-2 -right-2 bg-white rounded-full p-1" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Quiz Completed!
            </h2>
            <div className="flex items-center gap-4">
              <span className={`text-2xl font-bold ${getCompletionColor()}`}>
                {score}%
              </span>
              <span className="text-gray-500">Score</span>
            </div>
            {startedAt && completedAt && (
              <div className="text-sm text-gray-500">
                <span>Started: {new Date(startedAt).toLocaleString()}</span>
                <span className="mx-2">|</span>
                <span>Completed: {new Date(completedAt).toLocaleString()}</span>
              </div>
            )}
            <p className="text-gray-600 mb-4">{getCompletionMessage()}</p>
            <div className="flex items-center justify-center gap-4">
              <Badge variant="secondary" className="text-sm">
                {answeredCount} of {totalQuestions} answered
              </Badge>
              <Badge className={`text-sm ${getCompletionColor()}`}>
                {completionRate}% Complete
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {backendAnswers ? backendAnswers.length : answeredQuestions}
            </div>
            <div className="text-sm text-gray-600">Questions Answered</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {totalQuestions -
                (backendAnswers ? backendAnswers.length : answeredQuestions)}
            </div>
            <div className="text-sm text-gray-600">Questions Skipped</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {totalQuestions}
            </div>
            <div className="text-sm text-gray-600">Total Questions</div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button size="lg" onClick={onRetakeQuiz} variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" />
          Retake Quiz
        </Button>
        <Button size="lg" asChild>
          <Link href="/quizzes">
            <Home className="w-4 h-4 mr-2" />
            Back to Quizzes
          </Link>
        </Button>
      </div>

      {/* Quiz Summary */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Quiz Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Quiz Title:</span>
              <span className="font-medium">{quiz.title}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Completion Rate:</span>
              <span className={`font-medium ${getCompletionColor()}`}>
                {completionRate}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Questions Answered:</span>
              <span className="font-medium">
                {answeredCount}/{totalQuestions}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
