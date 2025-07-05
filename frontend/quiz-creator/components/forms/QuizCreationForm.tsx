"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, GripVertical, Save } from "lucide-react";

const questionOptionSchema = z.object({
  text: z
    .string()
    .min(1, "Option text cannot be empty")
    .max(500, "Option text cannot exceed 500 characters"),
  isCorrect: z.boolean(),
  order: z.number().min(1, "Order must be at least 1"),
});

const questionSchema = z.object({
  text: z
    .string()
    .min(1, "Question text cannot be empty")
    .max(1000, "Question text cannot exceed 1000 characters"),
  type: z.enum(["BOOLEAN", "INPUT", "CHECKBOX"]),
  order: z.number().min(1, "Order must be at least 1"),
  required: z.boolean(),
  options: z.array(questionOptionSchema).optional(),
});

const quizSchema = z.object({
  title: z
    .string()
    .min(1, "Title cannot be empty")
    .max(200, "Title cannot exceed 200 characters"),
  description: z
    .string()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional(),
  questions: z
    .array(questionSchema)
    .min(1, "At least one question is required")
    .max(50, "Maximum 50 questions allowed"),
});

type QuizFormData = z.infer<typeof quizSchema>;

interface QuizCreationFormProps {
  onSubmit: (data: QuizFormData) => Promise<void>;
  onCancel: () => void;
}

export default function QuizCreationForm({
  onSubmit,
  onCancel,
}: QuizCreationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: "",
      description: "",
      questions: [
        {
          text: "",
          type: "BOOLEAN",
          order: 1,
          required: true,
          options: [
            { text: "true", isCorrect: true, order: 1 },
            { text: "false", isCorrect: false, order: 2 },
          ],
        },
      ],
    },
    mode: "onChange",
  });

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const handleSubmit = async (data: QuizFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Error creating quiz:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addQuestion = () => {
    const newOrder = questionFields.length + 1;
    appendQuestion({
      text: "",
      type: "BOOLEAN",
      order: newOrder,
      required: true,
      options: [
        { text: "true", isCorrect: true, order: 1 },
        { text: "false", isCorrect: false, order: 2 },
      ],
    });
  };

  const addOption = (questionIndex: number) => {
    const currentOptions =
      form.getValues(`questions.${questionIndex}.options`) || [];
    const newOrder = currentOptions.length + 1;

    form.setValue(`questions.${questionIndex}.options`, [
      ...currentOptions,
      { text: "", isCorrect: false, order: newOrder },
    ]);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const currentOptions =
      form.getValues(`questions.${questionIndex}.options`) || [];
    const updatedOptions = currentOptions.filter(
      (_, index) => index !== optionIndex
    );

    // Update order numbers
    const reorderedOptions = updatedOptions.map((option, index) => ({
      ...option,
      order: index + 1,
    }));

    form.setValue(`questions.${questionIndex}.options`, reorderedOptions);
  };

  const handleQuestionTypeChange = (questionIndex: number, type: string) => {
    form.setValue(`questions.${questionIndex}.type`, type as any);

    // Reset options based on question type
    if (type === "INPUT") {
      form.setValue(`questions.${questionIndex}.options`, [
        { text: "", isCorrect: true, order: 1 },
      ]);
    } else if (type === "BOOLEAN") {
      form.setValue(`questions.${questionIndex}.options`, [
        { text: "true", isCorrect: true, order: 1 },
        { text: "false", isCorrect: false, order: 2 },
      ]);
    } else if (type === "CHECKBOX") {
      const currentOptions =
        form.getValues(`questions.${questionIndex}.options`) || [];
      if (currentOptions.length === 0) {
        form.setValue(`questions.${questionIndex}.options`, [
          { text: "Option 1", isCorrect: true, order: 1 },
          { text: "Option 2", isCorrect: false, order: 2 },
        ]);
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit, (errors) => {
          console.error("Form validation errors:", errors);
        })}
        className="space-y-8"
      >
        {/* Quiz Details */}
        <Card>
          <CardHeader>
            <CardTitle>Quiz Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quiz Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter quiz title..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter quiz description (optional)..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a brief description of what this quiz covers
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Questions */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">Questions</h2>
            <Button type="button" onClick={addQuestion} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </div>

          {questionFields.map((question, questionIndex) => (
            <Card key={question.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <GripVertical className="w-5 h-5 text-gray-400" />
                    Question {questionIndex + 1}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {form.watch(`questions.${questionIndex}.type`)}
                    </Badge>
                    {questionFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuestion(questionIndex)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name={`questions.${questionIndex}.text`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question Text *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your question..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`questions.${questionIndex}.type`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question Type *</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            handleQuestionTypeChange(questionIndex, value)
                          }
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select question type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="BOOLEAN">
                              Boolean (True/False)
                            </SelectItem>
                            <SelectItem value="INPUT">Text Input</SelectItem>
                            <SelectItem value="CHECKBOX">
                              Multiple Choice
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`questions.${questionIndex}.required`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Required</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(value === "true")
                          }
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="true">Yes</SelectItem>
                            <SelectItem value="false">No</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Options for choice questions */}
                {form.watch(`questions.${questionIndex}.type`) !== "INPUT" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <FormLabel>Answer Options</FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addOption(questionIndex)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Option
                      </Button>
                    </div>

                    {form
                      .watch(`questions.${questionIndex}.options`)
                      ?.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className="flex items-center gap-3 p-3 border rounded-lg"
                        >
                          <GripVertical className="w-4 h-4 text-gray-400" />
                          <div className="flex-1">
                            <FormField
                              control={form.control}
                              name={`questions.${questionIndex}.options.${optionIndex}.text`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      placeholder={`Option ${
                                        optionIndex + 1
                                      }...`}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={form.control}
                            name={`questions.${questionIndex}.options.${optionIndex}.isCorrect`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <input
                                    type={
                                      form.watch(
                                        `questions.${questionIndex}.type`
                                      ) === "CHECKBOX"
                                        ? "checkbox"
                                        : "radio"
                                    }
                                    checked={field.value}
                                    onChange={(e) => {
                                      const isCheckbox =
                                        form.watch(
                                          `questions.${questionIndex}.type`
                                        ) === "CHECKBOX";

                                      if (isCheckbox) {
                                        field.onChange(e.target.checked);
                                      } else {
                                        const currentOptions =
                                          form.getValues(
                                            `questions.${questionIndex}.options`
                                          ) || [];
                                        const updatedOptions =
                                          currentOptions.map(
                                            (opt: any, idx: number) => ({
                                              ...opt,
                                              isCorrect: idx === optionIndex,
                                            })
                                          );
                                        form.setValue(
                                          `questions.${questionIndex}.options`,
                                          updatedOptions
                                        );
                                      }
                                    }}
                                    name={`question-${questionIndex}`}
                                    className="w-4 h-4 text-indigo-600"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          {form.watch(`questions.${questionIndex}.options`)!
                            .length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                removeOption(questionIndex, optionIndex)
                              }
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                  </div>
                )}
                {/* Correct answer for INPUT questions */}
                {form.watch(`questions.${questionIndex}.type`) === "INPUT" && (
                  <div className="space-y-4">
                    <FormLabel>Correct Answer</FormLabel>
                    <FormField
                      control={form.control}
                      name={`questions.${questionIndex}.options.0.text`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Enter the correct answer..."
                              value={field.value}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                form.setValue(
                                  `questions.${questionIndex}.options.0.isCorrect`,
                                  true
                                );
                                form.setValue(
                                  `questions.${questionIndex}.options.0.order`,
                                  1
                                );
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Creating Quiz...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Create Quiz
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
