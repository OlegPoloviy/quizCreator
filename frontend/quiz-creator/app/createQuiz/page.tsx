"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import QuizCreationForm from "@/components/forms/QuizCreationForm";
import { toast } from "sonner";
import { quizService } from "../lib/quiz.service";
import { useRouter } from "next/navigation";

export default function CreateQuizPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      if (!data || !data.questions || !Array.isArray(data.questions)) {
        throw new Error(
          "Invalid form data: questions array is missing or invalid"
        );
      }

      const transformedData = {
        title: data.title,
        description: data.description,
        questions: data.questions.map((question: any, index: number) => ({
          text: question.text,
          type: question.type,
          order: index + 1,
          required: question.required ?? true,
          options: question.options,
        })),
      };

      await quizService.createQuiz(transformedData);
      toast.success("Quiz created successfully!");
      router.push("/quizzes");
    } catch (error) {
      console.error("Error creating quiz:", error);
      toast.error("Error creating quiz. Please try again.");
      throw error;
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" className="mb-4" onClick={handleCancel}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create New Quiz
          </h1>
          <p className="text-gray-600">
            Build an engaging quiz with questions and answer options
          </p>
        </div>

        {/* Quiz Creation Form */}
        <QuizCreationForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </div>
  );
}
