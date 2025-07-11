import axios from "axios";
import {
  CreateQuizDto,
  Quiz,
  SubmitAnswerDto,
  SubmitQuizDto,
} from "@/types/Quiz.types";

class QuizService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  }

  getConfig(options: RequestInit = {}): RequestInit {
    return {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };
  }

  async getQuizzes(): Promise<Quiz[]> {
    try {
      const response = await axios.get<Quiz[]>(`${this.baseUrl}/quiz`);
      return response.data;
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      throw error;
    }
  }

  async createQuiz(quiz: CreateQuizDto): Promise<Quiz> {
    try {
      const response = await axios.post<Quiz>(
        `${this.baseUrl}/quiz/create`,
        quiz
      );
      return response.data;
    } catch (error) {
      console.error("Error creating quiz:", error);
      throw error;
    }
  }

  async getQuizById(id: string): Promise<Quiz> {
    try {
      const response = await axios.get<Quiz>(`${this.baseUrl}/quiz/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error getting quiz:", error);
      throw error;
    }
  }

  async deleteQuizById(id: string): Promise<void> {
    try {
      await axios.delete<Quiz>(`${this.baseUrl}/quiz/${id}`);
    } catch (error) {
      console.error("Error getting quiz:", error);
      throw error;
    }
  }

  async submitAnswer(answer: SubmitAnswerDto) {
    try {
      const response = await axios.post<Quiz>(`${this.baseUrl}/quiz/submit`);
      console.log(answer);
      return response;
    } catch (error) {
      console.error("Error getting quiz:", error);
      throw error;
    }
  }

  async submitQuizAnswers(submitQuizDto: SubmitQuizDto) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/quiz/submit`,
        submitQuizDto
      );
      return response.data;
    } catch (error) {
      console.error("Error submitting quiz answers:", error);
      throw error;
    }
  }

  async updateQuiz(id: string, updateQuizDto: any) {
    try {
      const response = await axios.patch(
        `${this.baseUrl}/quiz/${id}`,
        updateQuizDto
      );
      return response.data;
    } catch (error) {
      console.error("Error updating quiz:", error);
      throw error;
    }
  }
}

export const quizService = new QuizService();
