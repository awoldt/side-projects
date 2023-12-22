//TABLES --
export interface _question {
  question_title: string;
  prompts: (string | null)[];
  correct_answer: number; // the index of prompts that is correct
  quiz_id?: string; //fk
}

export interface _quiz {
  quiz_id?: string; //pk
  quiz_title: string;
  created_on?: string;
  indexable: boolean;
}

export interface _gradedQuiz {
  graded_id?: number; //pk
  score: number;
  answers_given: number[];
  completed_on?: string;
  quiz_id: string; //fk
}
//-- END TABLES

export interface _RESPONSE_grade {
  score: number;
  graded_id: string;
  msg: string;
}

export interface _RESPONSE_get_quiz_grade {
  answers: number[];
  score: number;
}

export interface _RESPONSE_create_quiz {
  quizId: string;
}

interface _localstorage_quiz_structure {
  quiz_id: string;
  grade_id: string;
}

export interface _LOCALSTORAGE_quizs {
  graded_quizs: _localstorage_quiz_structure[];
}

export interface _PAGEDATA_quiz {
  quiz_id: string;
  quiz_title: string;
  quiz_created_on: string;
  questions: _question[];
  average_score: number;
  num_of_submissions: number;
  is_quiz_indexable: boolean;
}
