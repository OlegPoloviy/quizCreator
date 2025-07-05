export interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  text: string;
  type: "BOOLEAN" | "INPUT" | "CHECKBOX";
  options?: string[];
  correct_answer?: any;
}

export interface CreateQuizDto {
  title: string;
  description?: string;
  questions: {
    text: string;
    type: "BOOLEAN" | "INPUT" | "CHECKBOX";
    options?: string[];
    correct_answer?: any;
  }[];
}
