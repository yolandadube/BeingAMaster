'use client';

import { Book, Note, StudyTask } from '@/lib/types';
import { generateId } from '@/lib/utils';

// Mock data storage using localStorage (for demo purposes)
// In production, this would be replaced with Supabase or another database

const STORAGE_KEYS = {
  BOOKS: 'yolymatics_books',
  NOTES: 'yolymatics_notes',
  QUOTES: 'yolymatics_quotes',
  TASKS: 'yolymatics_tasks',
  BIBLE: 'yolymatics_bible',
  FLASHCARDS: 'yolymatics_flashcards',
};

// Helper functions for localStorage
function getFromStorage<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function saveToStorage<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

// Books
export function getBooks(): Book[] {
  return getFromStorage<Book>(STORAGE_KEYS.BOOKS);
}

export function addBook(book: Omit<Book, 'id' | 'dateAdded'>): Book {
  const newBook: Book = {
    ...book,
    id: generateId(),
    dateAdded: new Date(),
  };
  const books = getBooks();
  books.push(newBook);
  saveToStorage(STORAGE_KEYS.BOOKS, books);
  return newBook;
}

export function updateBook(id: string, updates: Partial<Book>): Book | null {
  const books = getBooks();
  const index = books.findIndex(b => b.id === id);
  if (index === -1) return null;
  books[index] = { ...books[index], ...updates };
  saveToStorage(STORAGE_KEYS.BOOKS, books);
  return books[index];
}

export function deleteBook(id: string): boolean {
  const books = getBooks();
  const filtered = books.filter(b => b.id !== id);
  if (filtered.length === books.length) return false;
  saveToStorage(STORAGE_KEYS.BOOKS, filtered);
  return true;
}

// Notes
export function getNotes(): Note[] {
  return getFromStorage<Note>(STORAGE_KEYS.NOTES);
}

export function addNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Note {
  const newNote: Note = {
    ...note,
    id: generateId(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const notes = getNotes();
  notes.push(newNote);
  saveToStorage(STORAGE_KEYS.NOTES, notes);
  return newNote;
}

export function updateNote(id: string, updates: Partial<Note>): Note | null {
  const notes = getNotes();
  const index = notes.findIndex(n => n.id === id);
  if (index === -1) return null;
  notes[index] = { ...notes[index], ...updates, updatedAt: new Date() };
  saveToStorage(STORAGE_KEYS.NOTES, notes);
  return notes[index];
}

export function deleteNote(id: string): boolean {
  const notes = getNotes();
  const filtered = notes.filter(n => n.id !== id);
  if (filtered.length === notes.length) return false;
  saveToStorage(STORAGE_KEYS.NOTES, filtered);
  return true;
}

// Study Tasks
export function getTasks(): StudyTask[] {
  return getFromStorage<StudyTask>(STORAGE_KEYS.TASKS);
}

export function addTask(task: Omit<StudyTask, 'id' | 'createdAt'>): StudyTask {
  const newTask: StudyTask = {
    ...task,
    id: generateId(),
    createdAt: new Date(),
  };
  const tasks = getTasks();
  tasks.push(newTask);
  saveToStorage(STORAGE_KEYS.TASKS, tasks);
  return newTask;
}

export function updateTask(id: string, updates: Partial<StudyTask>): StudyTask | null {
  const tasks = getTasks();
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return null;
  tasks[index] = { ...tasks[index], ...updates };
  saveToStorage(STORAGE_KEYS.TASKS, tasks);
  return tasks[index];
}

export function deleteTask(id: string): boolean {
  const tasks = getTasks();
  const filtered = tasks.filter(t => t.id !== id);
  if (filtered.length === tasks.length) return false;
  saveToStorage(STORAGE_KEYS.TASKS, filtered);
  return true;
}

// Initialize with sample data if empty
export function initializeSampleData(): void {
  if (typeof window === 'undefined') return;
  
  const books = getBooks();
  if (books.length === 0) {
    addBook({
      title: 'Mere Christianity',
      author: 'C.S. Lewis',
      subject: 'Christianity',
      status: 'currently-reading',
      progress: 45,
      totalPages: 227,
      difficulty: 'intermediate',
      tags: ['apologetics', 'theology'],
    });
    
    addBook({
      title: 'The Republic',
      author: 'Plato',
      subject: 'Philosophy',
      status: 'read-later',
      totalPages: 416,
      difficulty: 'advanced',
      tags: ['ancient philosophy', 'politics'],
    });
    
    addBook({
      title: 'Introduction to Electrodynamics',
      author: 'David J. Griffiths',
      subject: 'Physics',
      status: 'currently-reading',
      progress: 123,
      totalPages: 623,
      difficulty: 'expert',
      tags: ['electromagnetism', 'textbook'],
    });
  }
  
  const notes = getNotes();
  if (notes.length === 0) {
    addNote({
      title: 'The Problem of Evil',
      content: '# The Problem of Evil\n\nThe problem of evil is one of the most challenging philosophical questions...',
      subject: 'Philosophy',
      tags: ['theodicy', 'theology', 'ethics'],
      linkedNotes: [],
    });
    
    addNote({
      title: 'Maxwell\'s Equations',
      content: '# Maxwell\'s Equations\n\nThe four fundamental equations of electromagnetism:\n\n$$\\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\epsilon_0}$$',
      subject: 'Physics',
      tags: ['electromagnetism', 'equations'],
      linkedNotes: [],
    });
  }
  
  const tasks = getTasks();
  if (tasks.length === 0) {
    addTask({
      title: 'Read Chapter 3 of Mere Christianity',
      subject: 'Christianity',
      completed: false,
    });
    
    addTask({
      title: 'Complete problem set on Maxwell equations',
      subject: 'Physics',
      completed: false,
    });
  }
}
