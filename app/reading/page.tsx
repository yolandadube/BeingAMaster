'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getBooks, addBook, updateBook, deleteBook } from '@/lib/db/storage';
import { Book, ReadingStatus, SubjectArea } from '@/lib/types';
import { BookOpen, Plus, Trash2, Edit } from 'lucide-react';
import { getSubjectColor, getDifficultyColor } from '@/lib/utils';

export default function ReadingList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filter, setFilter] = useState<ReadingStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = () => {
    setBooks(getBooks());
  };

  const filteredBooks = books.filter(book => {
    const matchesFilter = filter === 'all' || book.status === filter;
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const currentlyReading = books.filter(b => b.status === 'currently-reading');
  const finished = books.filter(b => b.status === 'finished');
  const readLater = books.filter(b => b.status === 'read-later');

  const handleAddBook = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    addBook({
      title: formData.get('title') as string,
      author: formData.get('author') as string,
      subject: formData.get('subject') as SubjectArea,
      status: formData.get('status') as ReadingStatus,
      totalPages: parseInt(formData.get('totalPages') as string) || undefined,
      difficulty: formData.get('difficulty') as any,
      tags: (formData.get('tags') as string)?.split(',').map(t => t.trim()).filter(Boolean),
    });
    
    loadBooks();
    setShowAddForm(false);
    e.currentTarget.reset();
  };

  const handleDeleteBook = (id: string) => {
    if (confirm('Are you sure you want to delete this book?')) {
      deleteBook(id);
      loadBooks();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gold mb-2">Reading List</h1>
          <p className="text-gray-400">Manage your reading journey</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={20} className="mr-2" />
          Add Book
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hover>
          <CardContent>
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-1">Currently Reading</p>
              <p className="text-4xl font-bold text-gold">{currentlyReading.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card hover>
          <CardContent>
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-1">Finished</p>
              <p className="text-4xl font-bold text-green-500">{finished.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card hover>
          <CardContent>
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-1">Read Later</p>
              <p className="text-4xl font-bold text-blue-500">{readLater.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Book Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Book</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddBook} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    required
                    className="w-full bg-gray-medium border border-gold/20 rounded px-4 py-2 text-white focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Author *</label>
                  <input
                    type="text"
                    name="author"
                    required
                    className="w-full bg-gray-medium border border-gold/20 rounded px-4 py-2 text-white focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Subject *</label>
                  <select
                    name="subject"
                    required
                    className="w-full bg-gray-medium border border-gold/20 rounded px-4 py-2 text-white focus:outline-none focus:border-gold"
                  >
                    <option value="Christianity">Christianity</option>
                    <option value="Philosophy">Philosophy</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Cosmology">Cosmology</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Status *</label>
                  <select
                    name="status"
                    required
                    className="w-full bg-gray-medium border border-gold/20 rounded px-4 py-2 text-white focus:outline-none focus:border-gold"
                  >
                    <option value="currently-reading">Currently Reading</option>
                    <option value="finished">Finished</option>
                    <option value="read-later">Read Later</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Total Pages</label>
                  <input
                    type="number"
                    name="totalPages"
                    className="w-full bg-gray-medium border border-gold/20 rounded px-4 py-2 text-white focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Difficulty</label>
                  <select
                    name="difficulty"
                    className="w-full bg-gray-medium border border-gold/20 rounded px-4 py-2 text-white focus:outline-none focus:border-gold"
                  >
                    <option value="">Select...</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  name="tags"
                  placeholder="theology, ancient philosophy, textbook"
                  className="w-full bg-gray-medium border border-gold/20 rounded px-4 py-2 text-white focus:outline-none focus:border-gold"
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit">Add Book</Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Search and Filter */}
      <Card>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-gray-medium border border-gold/20 rounded px-4 py-2 text-white focus:outline-none focus:border-gold"
            />
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'primary' : 'outline'}
                onClick={() => setFilter('all')}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={filter === 'currently-reading' ? 'primary' : 'outline'}
                onClick={() => setFilter('currently-reading')}
                size="sm"
              >
                Reading
              </Button>
              <Button
                variant={filter === 'finished' ? 'primary' : 'outline'}
                onClick={() => setFilter('finished')}
                size="sm"
              >
                Finished
              </Button>
              <Button
                variant={filter === 'read-later' ? 'primary' : 'outline'}
                onClick={() => setFilter('read-later')}
                size="sm"
              >
                Read Later
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Books List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.length === 0 ? (
          <Card className="col-span-full">
            <CardContent>
              <p className="text-gray-400 text-center py-8">No books found</p>
            </CardContent>
          </Card>
        ) : (
          filteredBooks.map(book => (
            <Card key={book.id} hover>
              <CardContent className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">{book.title}</h3>
                    <p className="text-sm text-gray-400">{book.author}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteBook(book.id)}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-sm ${getSubjectColor(book.subject)}`}>
                    {book.subject}
                  </span>
                  {book.difficulty && (
                    <span className={`text-xs ${getDifficultyColor(book.difficulty)}`}>
                      {book.difficulty}
                    </span>
                  )}
                </div>

                {book.status === 'currently-reading' && book.totalPages && (
                  <div>
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

                {book.tags && book.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
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

                <div className="pt-2 border-t border-gold/10">
                  <span className="text-xs text-gray-400">
                    Status: <span className="text-gold capitalize">{book.status.replace('-', ' ')}</span>
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
