export interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  order: number;
  questionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  text: string;
  type: "BOOLEAN" | "INPUT" | "CHECKBOX";
  options?: QuestionOption[];
  correct_answer?: any;
}

export interface CreateQuizDto {
  title: string;
  description?: string;
  questions: {
    text: string;
    type: "BOOLEAN" | "INPUT" | "CHECKBOX";
    order: number;
    required?: boolean;
    options?: {
      text: string;
      isCorrect: boolean;
      order: number;
    }[];
  }[];
}

export interface SubmitAnswerDto {
  questionId: string;

  textAnswer?: string;

  booleanAnswer?: boolean;

  selectedOptions?: string[];
}

export interface SubmitQuizDto {
  quizId: string;

  answers: SubmitAnswerDto[];
}
