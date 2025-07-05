import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";

interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  answeredQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onFinish: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  canFinish: boolean;
}

export default function QuizProgress({
  currentQuestion,
  totalQuestions,
  answeredQuestions,
  onPrevious,
  onNext,
  onFinish,
  canGoPrevious,
  canGoNext,
  canFinish,
}: QuizProgressProps) {
  const progressPercentage = (answeredQuestions / totalQuestions) * 100;

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm sticky top-4 z-10">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Progress</span>
              <span>
                {answeredQuestions} of {totalQuestions} answered
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Question Navigation */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Question {currentQuestion} of {totalQuestions}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onPrevious}
                disabled={!canGoPrevious}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>

              {canFinish ? (
                <Button
                  size="sm"
                  onClick={onFinish}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Finish Quiz
                </Button>
              ) : (
                <Button size="sm" onClick={onNext} disabled={!canGoNext}>
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{answeredQuestions} Answered</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <span>{totalQuestions - answeredQuestions} Remaining</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
