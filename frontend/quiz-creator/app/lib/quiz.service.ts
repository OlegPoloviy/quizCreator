import axios from "axios";
import { Quiz } from "@/types/Quiz.types";

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
}

export const quizService = new QuizService();
