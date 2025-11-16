'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getBooks, getTasks, initializeSampleData } from '@/lib/db/storage';
import { Book, StudyTask } from '@/lib/types';
import { BookOpen, CheckCircle, Clock, Quote } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [books, setBooks] = useState<Book[]>([]);
  const [tasks, setTasks] = useState<StudyTask[]>([]);

  useEffect(() => {
    initializeSampleData();
    setBooks(getBooks());
    setTasks(getTasks());
  }, []);

  const currentlyReading = books.filter(b => b.status === 'currently-reading');
  const pendingTasks = tasks.filter(t => !t.completed);

  const bibleVerse = {
    text: "Trust in the LORD with all your heart and lean not on your own understanding",
    reference: "Proverbs 3:5"
  };

  const motivationalQuote = {
    text: "The only true wisdom is in knowing you know nothing.",
    author: "Socrates"
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gold mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome to your learning hub</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card hover>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Books</p>
                <p className="text-3xl font-bold text-gold">{books.length}</p>
              </div>
              <BookOpen className="text-gold/40" size={40} />
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Currently Reading</p>
                <p className="text-3xl font-bold text-gold">{currentlyReading.length}</p>
              </div>
              <Clock className="text-gold/40" size={40} />
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Completed</p>
                <p className="text-3xl font-bold text-gold">
                  {books.filter(b => b.status === 'finished').length}
                </p>
              </div>
              <CheckCircle className="text-gold/40" size={40} />
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending Tasks</p>
                <p className="text-3xl font-bold text-gold">{pendingTasks.length}</p>
              </div>
              <Clock className="text-gold/40" size={40} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Verse and Quote */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Quote size={20} />
              Daily Verse
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 italic mb-2">&quot;{bibleVerse.text}&quot;</p>
            <p className="text-gold text-sm">— {bibleVerse.reference}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Quote size={20} />
              Motivational Quote
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 italic mb-2">&quot;{motivationalQuote.text}&quot;</p>
            <p className="text-gold text-sm">— {motivationalQuote.author}</p>
          </CardContent>
        </Card>
      </div>

      {/* Currently Reading */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Currently Reading</CardTitle>
            <Link href="/reading">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {currentlyReading.length === 0 ? (
            <p className="text-gray-400">No books in progress</p>
          ) : (
            <div className="space-y-4">
              {currentlyReading.slice(0, 3).map(book => (
                <div key={book.id} className="border-l-4 border-gold pl-4 py-2">
                  <h4 className="font-semibold text-white">{book.title}</h4>
                  <p className="text-sm text-gray-400">{book.author}</p>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>
                        {book.progress || 0} / {book.totalPages || 0} pages
                      </span>
                    </div>
                    <div className="w-full bg-gray-medium rounded-full h-2">
                      <div
                        className="bg-gold rounded-full h-2 transition-all"
                        style={{
                          width: `${book.totalPages ? ((book.progress || 0) / book.totalPages) * 100 : 0}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tasks for the Week */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pending Tasks</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {pendingTasks.length === 0 ? (
            <p className="text-gray-400">No pending tasks</p>
          ) : (
            <ul className="space-y-3">
              {pendingTasks.slice(0, 5).map(task => (
                <li key={task.id} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded border-2 border-gold/40 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-white">{task.title}</p>
                    {task.subject && (
                      <span className="text-xs text-gold">{task.subject}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
