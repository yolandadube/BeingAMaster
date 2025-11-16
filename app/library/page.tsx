'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getBooks } from '@/lib/db/storage';
import { Book, SubjectArea } from '@/lib/types';
import { BookOpen, Upload, FileText, Tag } from 'lucide-react';
import { getSubjectColor, getDifficultyColor } from '@/lib/utils';

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<SubjectArea | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBooks(getBooks());
  }, []);

  const filteredBooks = books.filter(book => {
    const matchesSubject = selectedSubject === 'all' || book.subject === selectedSubject;
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSubject && matchesSearch;
  });

  const subjects: (SubjectArea | 'all')[] = ['all', 'Christianity', 'Philosophy', 'Mathematics', 'Physics', 'Cosmology'];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gold mb-2">Library</h1>
          <p className="text-gray-400">Your collection of books and documents</p>
        </div>
        <Button>
          <Upload size={20} className="mr-2" />
          Upload Document
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {subjects.map(subject => {
          const count = subject === 'all' ? books.length : books.filter(b => b.subject === subject).length;
          return (
            <Card
              key={subject}
              hover
              className={`cursor-pointer ${selectedSubject === subject ? 'border-gold' : ''}`}
              onClick={() => setSelectedSubject(subject)}
            >
              <CardContent>
                <div className="text-center">
                  <p className={`text-sm mb-1 ${subject === 'all' ? 'text-gold' : getSubjectColor(subject)}`}>
                    {subject === 'all' ? 'All Books' : subject}
                  </p>
                  <p className="text-2xl font-bold text-white">{count}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search */}
      <Card>
        <CardContent>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search by title, author, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-gray-medium border border-gold/20 rounded px-4 py-2 text-white focus:outline-none focus:border-gold"
            />
          </div>
        </CardContent>
      </Card>

      {/* Books Grid */}
      <div className="space-y-4">
        {filteredBooks.length === 0 ? (
          <Card>
            <CardContent>
              <p className="text-gray-400 text-center py-12">
                No books found in your library
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredBooks.map(book => (
            <Card key={book.id} hover className="cursor-pointer">
              <CardContent>
                <div className="flex items-start gap-6">
                  {/* Book Icon/Cover Placeholder */}
                  <div className="w-24 h-32 bg-gray-medium rounded flex items-center justify-center flex-shrink-0">
                    <BookOpen size={40} className="text-gold/40" />
                  </div>

                  {/* Book Details */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">{book.title}</h3>
                      <p className="text-gray-400">{book.author}</p>
                    </div>

                    <div className="flex items-center gap-4 flex-wrap">
                      <span className={`flex items-center gap-2 text-sm ${getSubjectColor(book.subject)}`}>
                        <Tag size={16} />
                        {book.subject}
                      </span>
                      {book.difficulty && (
                        <span className={`text-sm ${getDifficultyColor(book.difficulty)}`}>
                          Difficulty: {book.difficulty}
                        </span>
                      )}
                      {book.totalPages && (
                        <span className="text-sm text-gray-400">
                          {book.totalPages} pages
                        </span>
                      )}
                    </div>

                    {book.tags && book.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {book.tags.map(tag => (
                          <span
                            key={tag}
                            className="text-xs bg-gold/20 text-gold px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {book.notes && (
                      <div className="pt-3 border-t border-gold/10">
                        <p className="text-sm text-gray-400 line-clamp-2">{book.notes}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {book.pdfUrl && (
                        <Button size="sm" variant="outline">
                          <FileText size={16} className="mr-1" />
                          View PDF
                        </Button>
                      )}
                      {book.bookUrl && (
                        <Button size="sm" variant="outline">
                          Open Link
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
