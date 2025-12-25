
export enum Category {
  READING = 'Reading Comprehension',
  VOCABULARY = 'Vocabulary',
  GRAMMAR = 'Grammar & Writing',
  MATH = 'Mathematics',
  MOCK = 'Full Mock Test'
}

export interface Question {
  id: string;
  category: Category;
  passage?: string;
  questionText: string;
  options: string[];
  correctAnswer: number; // index
  explanation: string;
}

export interface QuizSession {
  questions: Question[];
  userAnswers: Record<string, number>;
  isCompleted: boolean;
  score: number;
}

export interface UserStats {
  completedQuizzes: number;
  averageScore: number;
  categoryScores: Record<Category, number>;
  questionsAnswered: number;
}
