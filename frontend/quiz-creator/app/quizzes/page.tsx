"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import QuizCard from "@/components/quizzes/QuizCard";
import QuizFilters from "@/components/quizzes/QuizFilters";
import EmptyState from "@/components/quizzes/EmptyState";
import { quizService } from "../lib/quiz.service";
import { Quiz } from "@/types/Quiz.types";
import { toast } from "sonner";
import QuizEditDialog from "@/components/quizzes/QuizEditDialog";

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleQuizDeleted = (quizId: string) => {
    setQuizzes((prevQuizzes) =>
      prevQuizzes.filter((quiz) => quiz.id !== quizId)
    );
    setFilteredQuizzes((prevQuizzes) =>
      prevQuizzes.filter((quiz) => quiz.id !== quizId)
    );
  };

  const handleQuizUpdate = async (
    quiz: Quiz,
    data: { title: string; description?: string }
  ) => {
    setIsSaving(true);
    try {
      const updatedQuiz = await quizService.updateQuiz(quiz.id, data);
      toast.success("Quiz updated!");
      setQuizzes((prev) =>
        prev.map((q) => (q.id === quiz.id ? { ...q, ...updatedQuiz } : q))
      );
      setFilteredQuizzes((prev) =>
        prev.map((q) => (q.id === quiz.id ? { ...q, ...updatedQuiz } : q))
      );
      setEditDialogOpen(false);
      setEditingQuiz(null);
    } catch (err) {
      toast.error("Failed to update quiz");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedQuizzes = await quizService.getQuizzes();
        setQuizzes(fetchedQuizzes);
        setFilteredQuizzes(fetchedQuizzes);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
        setError("Failed to load quizzes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  useEffect(() => {
    let filtered = [...quizzes];

    if (searchQuery) {
      filtered = filtered.filter(
        (quiz) =>
          quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (quiz.description &&
            quiz.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    switch (filterBy) {
      case "recent":
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        filtered = filtered.filter(
          (quiz) => new Date(quiz.createdAt) > oneWeekAgo
        );
        break;
      case "popular":
        break;
      case "short":
        filtered = filtered.filter((quiz) => quiz.questions.length <= 5);
        break;
      case "long":
        filtered = filtered.filter((quiz) => quiz.questions.length > 10);
        break;
    }

    // Apply sorting
    switch (sortBy) {
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "questions":
        filtered.sort((a, b) => b.questions.length - a.questions.length);
        break;
      default: // newest
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    setFilteredQuizzes(filtered);
  }, [quizzes, searchQuery, sortBy, filterBy]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Error Loading Quizzes
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                All Quizzes
              </h1>
              <p className="text-gray-600">
                Discover and take quizzes created by our community
              </p>
            </div>
            <Button size="lg" asChild>
              <Link href="/createQuiz">
                <Plus className="w-5 h-5 mr-2" />
                Create Quiz
              </Link>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <QuizFilters
            onSearchChange={setSearchQuery}
            onSortChange={setSortBy}
            onFilterChange={setFilterBy}
          />
        </div>

        {/* Results Count */}
        {filteredQuizzes.length > 0 && (
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredQuizzes.length} quiz
              {filteredQuizzes.length !== 1 ? "es" : ""}
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>
        )}

        {/* Quizzes Grid */}
        {filteredQuizzes.length > 0 ? (
          <>
            <QuizEditDialog
              open={editDialogOpen}
              onOpenChange={(open) => {
                setEditDialogOpen(open);
                if (!open) setEditingQuiz(null);
              }}
              quiz={editingQuiz}
              isSaving={isSaving}
              onSave={(data) => {
                if (editingQuiz) handleQuizUpdate(editingQuiz, data);
              }}
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredQuizzes.map((quiz) => (
                <div key={quiz.id} className="relative">
                  <QuizCard quiz={quiz} onQuizDeleted={handleQuizDeleted} />
                  <button
                    className="absolute top-2 right-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded px-2 py-1 text-xs"
                    onClick={() => {
                      setEditingQuiz(quiz);
                      setEditDialogOpen(true);
                    }}
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <EmptyState searchQuery={searchQuery} />
        )}
      </div>
    </div>
  );
}
