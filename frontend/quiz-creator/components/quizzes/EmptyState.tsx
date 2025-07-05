import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Plus, Search } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  searchQuery?: string;
}

export default function EmptyState({ searchQuery }: EmptyStateProps) {
  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardContent className="p-12 text-center">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
          {searchQuery ? (
            <Search className="w-8 h-8 text-indigo-600" />
          ) : (
            <Brain className="w-8 h-8 text-indigo-600" />
          )}
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          {searchQuery ? "No quizzes found" : "No quizzes yet"}
        </h3>

        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          {searchQuery
            ? `No quizzes match your search for "${searchQuery}". Try adjusting your search terms or browse all quizzes.`
            : "Get started by creating your first quiz. It's quick and easy!"}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="text-lg px-8 py-6" asChild>
            <Link href="/createQuiz">
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Quiz
            </Link>
          </Button>

          {searchQuery && (
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6"
              asChild
            >
              <Link href="/quizzes">View All Quizzes</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
