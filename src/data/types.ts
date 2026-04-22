// 维度类型定义
export type DimensionCategory = 'self' | 'emotion' | 'social' | 'stress';

export interface Dimension {
  id: string;
  name: string;
  category: DimensionCategory;
  score: number; // 0-100
}

export interface PersonalityResult {
  type: string;
  title: string;
  subtitle: string;
  description: string;
  quote: string;
  dimensions: Dimension[];
}

// 答题记录
export interface AnswerRecord {
  questionId: string;
  optionIndex: number;
}

// 进度存储
export interface QuizProgress {
  answers: AnswerRecord[];
  currentQuestionIndex: number;
}
