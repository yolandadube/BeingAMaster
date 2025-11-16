export type SubjectArea = 'Christianity' | 'Philosophy' | 'Mathematics' | 'Physics' | 'Cosmology';

export type ReadingStatus = 'currently-reading' | 'finished' | 'read-later';

export interface Book {
  id: string;
  title: string;
  author: string;
  subject: SubjectArea;
  status: ReadingStatus;
  progress?: number;
  totalPages?: number;
  notes?: string;
  quotes?: string[];
  pdfUrl?: string;
  bookUrl?: string;
  coverImage?: string;
  dateAdded: Date;
  dateStarted?: Date;
  dateFinished?: Date;
  tags?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Note {
  id: string;
  title: string;
  content: string;
  subject: SubjectArea;
  tags: string[];
  linkedNotes?: string[];
  createdAt: Date;
  updatedAt: Date;
  backlinks?: string[];
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  subject: SubjectArea;
  difficulty: number;
  lastReviewed?: Date;
  nextReview?: Date;
  tags?: string[];
}

export interface Quote {
  id: string;
  text: string;
  source: string;
  author?: string;
  subject: SubjectArea;
  page?: number;
  dateAdded: Date;
  tags?: string[];
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
}

export interface StudyTask {
  id: string;
  title: string;
  description?: string;
  subject?: SubjectArea;
  dueDate?: Date;
  completed: boolean;
  createdAt: Date;
}

export interface BibleReading {
  id: string;
  book: string;
  chapter: number;
  verses?: string;
  notes?: string;
  date: Date;
  reflection?: string;
}
