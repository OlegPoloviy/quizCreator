import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Clock, Play, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { quizService } from "@/app/lib/quiz.service";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: any[];
  createdAt: string;
  updatedAt: string;
}

interface QuizCardProps {
  quiz: Quiz;
  onQuizDeleted?: (quizId: string) => void;
}

export default function QuizCard({ quiz, onQuizDeleted }: QuizCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDeleteQuiz = async () => {
    try {
      await quizService.deleteQuizById(quiz.id);
      toast.success(`Quiz "${quiz.title}" deleted successfully`);
      onQuizDeleted?.(quiz.id);
    } catch (error) {
      console.error("Error deleting quiz:", error);
      toast.error("Failed to delete quiz. Please try again.");
    }
  };

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-indigo-600" />
            <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-1">
              {quiz.title}
            </CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs">
            {quiz.questions.length} questions
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {quiz.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {quiz.description}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{formatDate(quiz.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" className="flex-1" asChild>
            <Link href={`/quizzes/${quiz.id}`}>
              <Play className="w-4 h-4 mr-2" />
              Take Quiz
            </Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={`/quizzes/${quiz.id}/preview`}>
              <Eye className="w-4 h-4" />
            </Link>
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Quiz</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete &quot;{quiz.title}
                        &quot;? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteQuiz}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete quiz</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}
