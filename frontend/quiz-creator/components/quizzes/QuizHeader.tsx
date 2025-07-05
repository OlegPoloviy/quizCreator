import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Clock, Users, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuizHeaderProps {
  quiz: {
    id: string;
    title: string;
    description?: string;
    questions: any[];
    createdAt: string;
    updatedAt: string;
  };
  onStartQuiz: () => void;
  isStarted?: boolean;
}

export default function QuizHeader({
  quiz,
  onStartQuiz,
  isStarted = false,
}: QuizHeaderProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-6 w-6 text-indigo-600" />
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                {quiz.title}
              </h1>
            </div>

            {quiz.description && (
              <p className="text-gray-600 mb-4 max-w-2xl">{quiz.description}</p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Created {formatDate(quiz.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{quiz.questions.length} questions</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {quiz.questions.length <= 5
                  ? "Quick Quiz"
                  : quiz.questions.length <= 10
                  ? "Standard Quiz"
                  : "Comprehensive Quiz"}
              </Badge>
            </div>
          </div>

          <div className="flex-shrink-0">
            <Button
              size="lg"
              className="text-lg px-8 py-6"
              onClick={onStartQuiz}
              disabled={isStarted}
            >
              <Play className="w-5 h-5 mr-2" />
              {isStarted ? "Quiz Started" : "Start Quiz"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
