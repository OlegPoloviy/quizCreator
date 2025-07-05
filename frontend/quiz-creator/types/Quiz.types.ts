export interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  quiz_id: string;
  type: "boolean" | "input" | "checkbox";
  question_text: string;
  options?: string[];
  correct_answer?: any;
  order_index: number;
}

export interface CreateQuizDto {
  title: string;
  description?: string;
  questions: {
    questionText: string;
    type: "boolean" | "input" | "checkbox";
    options?: string[];
    correctAnswer?: any;
  }[];
}
