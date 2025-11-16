'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getBooks, getNotes } from '@/lib/db/storage';
import { Book, Note, SubjectArea } from '@/lib/types';
import { BookOpen, FileText, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface SubjectLayoutProps {
  subject: SubjectArea;
  icon: React.ReactNode;
  description: string;
  specialContent?: React.ReactNode;
}

export default function SubjectLayout({ subject, icon, description, specialContent }: SubjectLayoutProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBooks(getBooks().filter(b => b.subject === subject));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNotes(getNotes().filter(n => n.subject === subject));
  }, [subject]);

  const currentlyReading = books.filter(b => b.status === 'currently-reading');
  const recentNotes = notes.slice(-3).reverse();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="text-gold">{icon}</div>
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-gold mb-2">{subject}</h1>
          <p className="text-gray-400">{description}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <p className="text-gray-400 text-sm">Study Notes</p>
                <p className="text-3xl font-bold text-gold">{notes.length}</p>
              </div>
              <FileText className="text-gold/40" size={40} />
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">In Progress</p>
                <p className="text-3xl font-bold text-gold">{currentlyReading.length}</p>
              </div>
              <TrendingUp className="text-gold/40" size={40} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Special Content (Subject-specific) */}
      {specialContent && specialContent}

      {/* Currently Reading */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Currently Reading</CardTitle>
            <Link href="/reading">
              <Button variant="outline" size="sm">View All Books</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {currentlyReading.length === 0 ? (
            <p className="text-gray-400">No books in progress for {subject}</p>
          ) : (
            <div className="space-y-4">
              {currentlyReading.map(book => (
                <div key={book.id} className="border-l-4 border-gold pl-4 py-2">
                  <h4 className="font-semibold text-white">{book.title}</h4>
                  <p className="text-sm text-gray-400">{book.author}</p>
                  {book.totalPages && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{book.progress || 0} / {book.totalPages} pages</span>
                      </div>
                      <div className="w-full bg-gray-medium rounded-full h-2">
                        <div
                          className="bg-gold rounded-full h-2 transition-all"
                          style={{
                            width: `${((book.progress || 0) / book.totalPages) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Notes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Notes</CardTitle>
            <Link href="/notes">
              <Button variant="outline" size="sm">View All Notes</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentNotes.length === 0 ? (
            <p className="text-gray-400">No notes for {subject}</p>
          ) : (
            <div className="space-y-4">
              {recentNotes.map(note => (
                <div key={note.id} className="border-l-4 border-gold pl-4 py-2">
                  <h4 className="font-semibold text-white mb-1">{note.title}</h4>
                  <div className="flex gap-2 flex-wrap">
                    {note.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="text-xs bg-gold/20 text-gold px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Books */}
      <Card>
        <CardHeader>
          <CardTitle>All {subject} Books</CardTitle>
        </CardHeader>
        <CardContent>
          {books.length === 0 ? (
            <p className="text-gray-400">No books for {subject}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {books.map(book => (
                <div key={book.id} className="border border-gold/20 rounded p-4 hover:border-gold/40 transition-colors">
                  <h4 className="font-semibold text-white mb-1">{book.title}</h4>
                  <p className="text-sm text-gray-400 mb-2">{book.author}</p>
                  <span className="text-xs text-gold capitalize">{book.status.replace('-', ' ')}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
