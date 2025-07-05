"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Home, ArrowLeft, Search, Zap } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <Brain className="h-12 w-12 text-indigo-600" />
          <span className="text-2xl font-bold text-gray-900">QuizCreator</span>
        </div>

        {/* 404 Content */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-12">
            {/* 404 Number */}
            <div className="mb-8">
              <h1 className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
                404
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto rounded-full"></div>
            </div>

            {/* Error Message */}
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Oops! Page Not Found
              </h2>
              <p className="text-xl text-gray-600 max-w-md mx-auto">
                The quiz you&#39;re looking for seems to have wandered off.
                Don&#39;t worry, we&#39;ll help you find your way back!
              </p>
            </div>

            {/* Decorative Elements */}
            <div className="flex justify-center items-center space-x-4 mb-8">
              <div className="w-3 h-3 bg-indigo-400 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-300"></div>
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-600"></div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="text-lg px-8 py-6" asChild>
                <Link href="/">
                  <Home className="w-5 h-5 mr-2" />
                  Go Home
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6"
                asChild
              >
                <Link href="/createQuiz">
                  <Zap className="w-5 h-5 mr-2" />
                  Create Quiz
                </Link>
              </Button>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <Link
                href="/quizzes"
                className="flex items-center justify-center space-x-2 p-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-600 hover:text-gray-900"
              >
                <Search className="w-4 h-4" />
                <span>Browse Quizzes</span>
              </Link>
              <Link
                href="/createQuiz"
                className="flex items-center justify-center space-x-2 p-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-600 hover:text-gray-900"
              >
                <Brain className="w-4 h-4" />
                <span>Create New</span>
              </Link>
              <button
                onClick={() => window.history.back()}
                className="flex items-center justify-center space-x-2 p-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Go Back</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Fun Message */}
        <div className="mt-8">
          <p className="text-gray-500 text-sm">
            💡 Pro tip: Use the navigation above to explore our quiz creation
            features!
          </p>
        </div>

        {/* Decorative Background Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-indigo-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-blue-200 rounded-full opacity-20 animate-pulse delay-500"></div>
          <div className="absolute bottom-40 right-1/3 w-20 h-20 bg-indigo-200 rounded-full opacity-20 animate-pulse delay-1500"></div>
        </div>
      </div>
    </div>
  );
}
