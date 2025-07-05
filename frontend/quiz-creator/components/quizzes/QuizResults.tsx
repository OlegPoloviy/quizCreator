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
}

export default function QuizResults({
  quiz,
  userAnswers,
  onRetakeQuiz,
}: QuizResultsProps) {
  const answeredQuestions = Object.keys(userAnswers).length;
  const totalQuestions = quiz.questions.length;
  const completionPercentage = Math.round(
    (answeredQuestions / totalQuestions) * 100
  );

  const getCompletionMessage = () => {
    if (completionPercentage === 100) {
      return "Perfect! You completed all questions.";
    } else if (completionPercentage >= 80) {
      return "Great job! You answered most questions.";
    } else if (completionPercentage >= 60) {
      return "Good effort! You answered many questions.";
    } else {
      return "You answered some questions. Consider reviewing the quiz.";
    }
  };

  const getCompletionColor = () => {
    if (completionPercentage === 100) return "text-green-600";
    if (completionPercentage >= 80) return "text-blue-600";
    if (completionPercentage >= 60) return "text-yellow-600";
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
            <p className="text-gray-600 mb-4">{getCompletionMessage()}</p>
            <div className="flex items-center justify-center gap-4">
              <Badge variant="secondary" className="text-sm">
                {answeredQuestions} of {totalQuestions} answered
              </Badge>
              <Badge className={`text-sm ${getCompletionColor()}`}>
                {completionPercentage}% Complete
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
              {answeredQuestions}
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
              {totalQuestions - answeredQuestions}
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
                {completionPercentage}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Questions Answered:</span>
              <span className="font-medium">
                {answeredQuestions}/{totalQuestions}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
