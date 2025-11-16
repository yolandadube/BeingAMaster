'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getNotes, addNote, deleteNote, updateNote } from '@/lib/db/storage';
import { Note, SubjectArea } from '@/lib/types';
import { Plus, Trash2, Edit, Save, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { getSubjectColor } from '@/lib/utils';

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = () => {
    setNotes(getNotes());
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddNote = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newNote = addNote({
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      subject: formData.get('subject') as SubjectArea,
      tags: (formData.get('tags') as string)?.split(',').map(t => t.trim()).filter(Boolean) || [],
      linkedNotes: [],
    });
    
    loadNotes();
    setShowAddForm(false);
    setSelectedNote(newNote);
    e.currentTarget.reset();
  };

  const handleUpdateNote = () => {
    if (selectedNote) {
      updateNote(selectedNote.id, { content: editContent });
      loadNotes();
      setIsEditing(false);
      setSelectedNote({ ...selectedNote, content: editContent });
    }
  };

  const handleDeleteNote = (id: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      deleteNote(id);
      loadNotes();
      if (selectedNote?.id === id) {
        setSelectedNote(null);
      }
    }
  };

  const startEditing = () => {
    if (selectedNote) {
      setEditContent(selectedNote.content);
      setIsEditing(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gold mb-2">Study Notes</h1>
          <p className="text-gray-400">Organize your knowledge</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={20} className="mr-2" />
          New Note
        </Button>
      </div>

      {/* Add Note Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Note</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddNote} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-full bg-gray-medium border border-gold/20 rounded px-4 py-2 text-white focus:outline-none focus:border-gold"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                  <label className="block text-sm text-gray-400 mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    name="tags"
                    placeholder="concept, important, review"
                    className="w-full bg-gray-medium border border-gold/20 rounded px-4 py-2 text-white focus:outline-none focus:border-gold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Content (Markdown supported) *</label>
                <textarea
                  name="content"
                  required
                  rows={10}
                  placeholder="# Your Note Title&#10;&#10;Write your note here with **markdown** support and $\LaTeX$ math: $E = mc^2$"
                  className="w-full bg-gray-medium border border-gold/20 rounded px-4 py-2 text-white focus:outline-none focus:border-gold font-mono text-sm"
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit">Create Note</Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card>
        <CardContent>
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-medium border border-gold/20 rounded px-4 py-2 text-white focus:outline-none focus:border-gold"
          />
        </CardContent>
      </Card>

      {/* Notes Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notes List */}
        <div className="lg:col-span-1 space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
          {filteredNotes.length === 0 ? (
            <Card>
              <CardContent>
                <p className="text-gray-400 text-center py-4">No notes found</p>
              </CardContent>
            </Card>
          ) : (
            filteredNotes.map(note => (
              <Card
                key={note.id}
                hover
                className={`cursor-pointer ${selectedNote?.id === note.id ? 'border-gold' : ''}`}
                onClick={() => {
                  setSelectedNote(note);
                  setIsEditing(false);
                }}
              >
                <CardContent className="space-y-2">
                  <h3 className="font-semibold text-white">{note.title}</h3>
                  <p className={`text-sm ${getSubjectColor(note.subject)}`}>
                    {note.subject}
                  </p>
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {note.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="text-xs bg-gold/20 text-gold px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Note Viewer/Editor */}
        <div className="lg:col-span-2">
          {selectedNote ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <CardTitle>{selectedNote.title}</CardTitle>
                    <p className={`text-sm ${getSubjectColor(selectedNote.subject)} mt-1`}>
                      {selectedNote.subject}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button size="sm" onClick={handleUpdateNote}>
                          <Save size={16} className="mr-1" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                          <X size={16} className="mr-1" />
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" variant="outline" onClick={startEditing}>
                          <Edit size={16} className="mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteNote(selectedNote.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={20}
                    className="w-full bg-gray-medium border border-gold/20 rounded px-4 py-2 text-white focus:outline-none focus:border-gold font-mono text-sm"
                  />
                ) : (
                  <div className="prose prose-invert prose-gold max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkMath, remarkGfm]}
                      rehypePlugins={[rehypeKatex]}
                      components={{
                        h1: ({ children }) => <h1 className="text-3xl font-bold text-gold mb-4">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-2xl font-bold text-gold mb-3">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-xl font-bold text-gold mb-2">{children}</h3>,
                        p: ({ children }) => <p className="text-gray-300 mb-4">{children}</p>,
                        code: ({ children }) => <code className="bg-gray-medium text-gold px-2 py-1 rounded">{children}</code>,
                        pre: ({ children }) => <pre className="bg-gray-medium p-4 rounded overflow-x-auto">{children}</pre>,
                        ul: ({ children }) => <ul className="list-disc list-inside text-gray-300 mb-4">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside text-gray-300 mb-4">{children}</ol>,
                        a: ({ children, href }) => <a href={href} className="text-gold hover:text-gold-light underline">{children}</a>,
                      }}
                    >
                      {selectedNote.content}
                    </ReactMarkdown>
                  </div>
                )}
                {selectedNote.tags.length > 0 && !isEditing && (
                  <div className="mt-6 pt-4 border-t border-gold/20">
                    <p className="text-sm text-gray-400 mb-2">Tags:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedNote.tags.map(tag => (
                        <span
                          key={tag}
                          className="bg-gold/20 text-gold px-3 py-1 rounded text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent>
                <p className="text-gray-400 text-center py-12">
                  Select a note to view or create a new one
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
