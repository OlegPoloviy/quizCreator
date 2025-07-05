"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Square, Type } from "lucide-react";
import { Question } from "@/types/Quiz.types";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  onAnswerChange: (questionId: string, answer: any) => void;
  userAnswer?: any;
  isAnswered?: boolean;
}

export default function QuestionCard({
  question,
  questionNumber,
  onAnswerChange,
  userAnswer,
  isAnswered = false,
}: QuestionCardProps) {
  const [textInput, setTextInput] = useState(userAnswer || "");

  // Add defensive checks for question data
  if (!question || !question.text || !question.type) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>Invalid question data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Add debug logging for current question and answer
  console.log("[QuestionCard] Question:", question);
  console.log("[QuestionCard] User answer:", userAnswer);
  console.log("[QuestionCard] Type:", question.type);

  const handleAnswerChange = (answer: any) => {
    onAnswerChange(question.id, answer);
  };

  const handleTextInputChange = (value: string) => {
    setTextInput(value);
    handleAnswerChange(value);
  };

  const getQuestionTypeIcon = () => {
    switch (question.type) {
      case "BOOLEAN":
        return <Circle className="w-4 h-4" />;
      case "CHECKBOX":
        return <Square className="w-4 h-4" />;
      case "INPUT":
        return <Type className="w-4 h-4" />;
      default:
        return <Circle className="w-4 h-4" />;
    }
  };

  const getQuestionTypeLabel = () => {
    switch (question.type) {
      case "BOOLEAN":
        return "True/False";
      case "CHECKBOX":
        return "Multiple Choice";
      case "INPUT":
        return "Text Answer";
      default:
        return "Question";
    }
  };

  return (
    <Card
      className={`border-0 shadow-lg transition-all duration-300 ${
        isAnswered ? "ring-2 ring-green-200 bg-green-50/50" : "hover:shadow-xl"
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-900">
              Question {questionNumber}
            </span>
            <Badge variant="secondary" className="text-xs">
              {getQuestionTypeLabel()}
            </Badge>
          </div>
          {isAnswered && <CheckCircle className="w-5 h-5 text-green-600" />}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-gray-900 text-lg mb-6 leading-relaxed">
          {question.text}
        </p>

        {/* Answer Options */}
        <div className="space-y-3">
          {question.type === "BOOLEAN" && (
            <div className="space-y-2">
              {["true", "false"].map((option) => (
                <label
                  key={option}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    userAnswer === option
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option}
                    checked={userAnswer === option}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    className="w-4 h-4 text-indigo-600"
                  />
                  <span className="text-gray-900 capitalize">
                    {option === "true" ? "True" : "False"}
                  </span>
                </label>
              ))}
            </div>
          )}

          {question.type === "CHECKBOX" && Array.isArray(question.options) && (
            <div className="space-y-2">
              {question.options.map((option, index) => {
                if (
                  !option ||
                  typeof option !== "object" ||
                  !option.text ||
                  !option.id
                ) {
                  return null;
                }
                return (
                  <label
                    key={option.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      Array.isArray(userAnswer) &&
                      userAnswer.includes(option.id)
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      value={option.id}
                      checked={
                        Array.isArray(userAnswer) &&
                        userAnswer.includes(option.id)
                      }
                      onChange={(e) => {
                        const currentAnswers = Array.isArray(userAnswer)
                          ? userAnswer
                          : [];
                        if (e.target.checked) {
                          handleAnswerChange([...currentAnswers, option.id]);
                        } else {
                          handleAnswerChange(
                            currentAnswers.filter((a) => a !== option.id)
                          );
                        }
                      }}
                      className="w-4 h-4 text-indigo-600"
                    />
                    <span className="text-gray-900">{option.text}</span>
                  </label>
                );
              })}
            </div>
          )}

          {question.type === "INPUT" && (
            <div className="space-y-2">
              <textarea
                value={textInput}
                onChange={(e) => handleTextInputChange(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                rows={3}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
