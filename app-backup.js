// Reading Library App - Main JavaScript

class ReadingLibrary {
    constructor() {
        this.books = this.loadBooks();
        this.currentEditId = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderBooks();
        this.updateStats();
    }

    setupEventListeners() {
        // Add book button
        document.getElementById('addBookBtn').addEventListener('click', () => {
            this.openModal();
        });

        // Modal close button
        document.querySelector('.close').addEventListener('click', () => {
            this.closeModal();
        });

        // Cancel button
        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.closeModal();
        });

        // Click outside modal to close
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('bookModal');
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // Form submit
        document.getElementById('bookForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveBook();
        });

        // Progress slider
        document.getElementById('bookProgress').addEventListener('input', (e) => {
            document.getElementById('progressValue').textContent = e.target.value;
        });

        // Status change updates progress
        document.getElementById('bookStatus').addEventListener('change', (e) => {
            const progressSlider = document.getElementById('bookProgress');
            if (e.target.value === 'completed') {
                progressSlider.value = 100;
            } else if (e.target.value === 'to-read') {
                progressSlider.value = 0;
            }
            document.getElementById('progressValue').textContent = progressSlider.value;
        });

        // Filters
        document.getElementById('categoryFilter').addEventListener('change', () => {
            this.renderBooks();
        });

        document.getElementById('statusFilter').addEventListener('change', () => {
            this.renderBooks();
        });

        document.getElementById('searchInput').addEventListener('input', () => {
            this.renderBooks();
        });
    }

    openModal(book = null) {
        const modal = document.getElementById('bookModal');
        const modalTitle = document.getElementById('modalTitle');
        const form = document.getElementById('bookForm');

        if (book) {
            // Edit mode
            this.currentEditId = book.id;
            modalTitle.textContent = 'Edit Book';
            document.getElementById('bookTitle').value = book.title;
            document.getElementById('bookAuthor').value = book.author;
            document.getElementById('bookCategory').value = book.category;
            document.getElementById('bookStatus').value = book.status;
            document.getElementById('bookProgress').value = book.progress;
            document.getElementById('progressValue').textContent = book.progress;
            document.getElementById('bookNotes').value = book.notes || '';
        } else {
            // Add mode
            this.currentEditId = null;
            modalTitle.textContent = 'Add New Book';
            form.reset();
            document.getElementById('progressValue').textContent = '0';
        }

        modal.style.display = 'block';
    }

    closeModal() {
        const modal = document.getElementById('bookModal');
        modal.style.display = 'none';
        this.currentEditId = null;
    }

    saveBook() {
        const book = {
            id: this.currentEditId || Date.now(),
            title: document.getElementById('bookTitle').value.trim(),
            author: document.getElementById('bookAuthor').value.trim(),
            category: document.getElementById('bookCategory').value,
            status: document.getElementById('bookStatus').value,
            progress: parseInt(document.getElementById('bookProgress').value),
            notes: document.getElementById('bookNotes').value.trim(),
            dateAdded: this.currentEditId ? 
                this.books.find(b => b.id === this.currentEditId).dateAdded : 
                new Date().toISOString()
        };

        if (this.currentEditId) {
            // Update existing book
            const index = this.books.findIndex(b => b.id === this.currentEditId);
            this.books[index] = book;
        } else {
            // Add new book
            this.books.push(book);
        }

        this.saveBooks();
        this.renderBooks();
        this.updateStats();
        this.closeModal();
    }

    deleteBook(id) {
        if (confirm('Are you sure you want to delete this book?')) {
            this.books = this.books.filter(b => b.id !== id);
            this.saveBooks();
            this.renderBooks();
            this.updateStats();
        }
    }

    renderBooks() {
        const bookList = document.getElementById('bookList');
        const emptyState = document.getElementById('emptyState');
        
        // Apply filters
        const filteredBooks = this.getFilteredBooks();

        if (filteredBooks.length === 0) {
            bookList.style.display = 'none';
            emptyState.style.display = 'block';
            if (this.books.length > 0) {
                emptyState.innerHTML = '<p>📖 No books match your filters.</p><p>Try adjusting your search criteria.</p>';
            } else {
                emptyState.innerHTML = '<p>📖 No books in your library yet.</p><p>Click "Add New Book" to get started!</p>';
            }
            return;
        }

        bookList.style.display = 'grid';
        emptyState.style.display = 'none';

        bookList.innerHTML = filteredBooks.map(book => this.createBookCard(book)).join('');

        // Attach event listeners to buttons
        filteredBooks.forEach(book => {
            document.getElementById(`edit-${book.id}`).addEventListener('click', () => {
                this.openModal(book);
            });

            document.getElementById(`delete-${book.id}`).addEventListener('click', () => {
                this.deleteBook(book.id);
            });
        });
    }

    createBookCard(book) {
        const statusLabels = {
            'to-read': 'To Read',
            'reading': 'Reading',
            'completed': 'Completed'
        };

        return `
            <div class="book-card">
                <div class="book-header">
                    <div class="book-title">${this.escapeHtml(book.title)}</div>
                    <div class="book-author">by ${this.escapeHtml(book.author)}</div>
                </div>
                <div class="book-meta">
                    <span class="badge badge-category">${this.escapeHtml(book.category)}</span>
                    <span class="badge badge-status ${book.status}">${statusLabels[book.status]}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${book.progress}%"></div>
                </div>
                <div class="progress-text">${book.progress}% complete</div>
                ${book.notes ? `<div class="book-notes">${this.escapeHtml(book.notes)}</div>` : ''}
                <div class="book-actions">
                    <button id="edit-${book.id}" class="btn btn-small btn-edit">Edit</button>
                    <button id="delete-${book.id}" class="btn btn-small btn-delete">Delete</button>
                </div>
            </div>
        `;
    }

    getFilteredBooks() {
        const categoryFilter = document.getElementById('categoryFilter').value;
        const statusFilter = document.getElementById('statusFilter').value;
        const searchQuery = document.getElementById('searchInput').value.toLowerCase().trim();

        return this.books.filter(book => {
            const matchesCategory = categoryFilter === 'all' || book.category === categoryFilter;
            const matchesStatus = statusFilter === 'all' || book.status === statusFilter;
            const matchesSearch = !searchQuery || 
                book.title.toLowerCase().includes(searchQuery) ||
                book.author.toLowerCase().includes(searchQuery) ||
                (book.notes && book.notes.toLowerCase().includes(searchQuery));

            return matchesCategory && matchesStatus && matchesSearch;
        });
    }

    updateStats() {
        const total = this.books.length;
        const reading = this.books.filter(b => b.status === 'reading').length;
        const completed = this.books.filter(b => b.status === 'completed').length;
        const toRead = this.books.filter(b => b.status === 'to-read').length;

        document.getElementById('totalBooks').textContent = total;
        document.getElementById('readingBooks').textContent = reading;
        document.getElementById('completedBooks').textContent = completed;
        document.getElementById('toReadBooks').textContent = toRead;
    }

    loadBooks() {
        try {
            const stored = localStorage.getItem('readingLibrary');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading books:', error);
            return [];
        }
    }

    saveBooks() {
        try {
            localStorage.setItem('readingLibrary', JSON.stringify(this.books));
        } catch (error) {
            console.error('Error saving books:', error);
            alert('Failed to save books. Please check your browser storage settings.');
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ReadingLibrary();
});
