// Academic Research Library - Enhanced JavaScript

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
        // Add material button
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
            modalTitle.textContent = 'Edit Material';
            document.getElementById('bookTitle').value = book.title;
            document.getElementById('bookAuthor').value = book.author;
            document.getElementById('materialType').value = book.materialType || 'Book';
            document.getElementById('materialLink').value = book.materialLink || '';
            document.getElementById('bookCategory').value = book.category;
            document.getElementById('bookStatus').value = book.status;
            document.getElementById('bookProgress').value = book.progress;
            document.getElementById('progressValue').textContent = book.progress;
            document.getElementById('bookNotes').value = book.notes || '';
        } else {
            // Add mode
            this.currentEditId = null;
            modalTitle.textContent = 'Add New Material';
            form.reset();
            document.getElementById('progressValue').textContent = '0';
        }

        modal.style.display = 'block';
        // Focus first input for better UX
        setTimeout(() => {
            document.getElementById('bookTitle').focus();
        }, 100);
    }

    closeModal() {
        const modal = document.getElementById('bookModal');
        modal.style.display = 'none';
        this.currentEditId = null;
        document.getElementById('bookForm').reset();
        document.getElementById('progressValue').textContent = '0';
    }

    saveBook() {
        const title = document.getElementById('bookTitle').value.trim();
        const author = document.getElementById('bookAuthor').value.trim();
        const materialType = document.getElementById('materialType').value;
        const materialLink = document.getElementById('materialLink').value.trim();
        const category = document.getElementById('bookCategory').value;
        const status = document.getElementById('bookStatus').value;
        const progress = parseInt(document.getElementById('bookProgress').value);
        const notes = document.getElementById('bookNotes').value.trim();

        if (!title || !author || !materialType || !category || !status) {
            alert('Please fill in all required fields.');
            return;
        }

        const book = {
            id: this.currentEditId || Date.now(),
            title,
            author,
            materialType,
            materialLink,
            category,
            status,
            progress,
            notes,
            dateAdded: this.currentEditId ? 
                this.books.find(b => b.id === this.currentEditId)?.dateAdded : 
                new Date().toISOString(),
            dateModified: new Date().toISOString()
        };

        if (this.currentEditId) {
            // Update existing
            const index = this.books.findIndex(b => b.id === this.currentEditId);
            this.books[index] = book;
        } else {
            // Add new
            this.books.push(book);
        }

        this.saveBooks();
        this.renderBooks();
        this.updateStats();
        this.closeModal();
    }

    deleteBook(id) {
        if (confirm('Are you sure you want to delete this material?')) {
            this.books = this.books.filter(book => book.id !== id);
            this.saveBooks();
            this.renderBooks();
            this.updateStats();
        }
    }

    renderBooks() {
        const filteredBooks = this.getFilteredBooks();
        const booksGrid = document.getElementById('booksGrid');
        const emptyState = document.getElementById('emptyState');

        if (filteredBooks.length === 0) {
            booksGrid.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';
        booksGrid.innerHTML = filteredBooks.map(book => `
            <div class="book-card" data-status="${book.status}">
                <div class="book-header">
                    <div class="book-type">${this.escapeHtml(book.materialType || 'Book')}</div>
                    <div class="book-category">${this.escapeHtml(book.category)}</div>
                </div>
                <h3 class="book-title">${this.escapeHtml(book.title)}</h3>
                <p class="book-author">by ${this.escapeHtml(book.author)}</p>
                
                ${book.materialLink ? `
                    <div class="material-link">
                        <a href="${this.escapeHtml(book.materialLink)}" target="_blank" rel="noopener noreferrer">
                            📎 Open Link
                        </a>
                    </div>
                ` : ''}
                
                <div class="book-status">
                    <span class="status-badge status-${book.status}">
                        ${this.getStatusIcon(book.status)} ${this.capitalizeFirst(book.status.replace('-', ' '))}
                    </span>
                </div>
                
                <div class="progress-section">
                    <div class="progress-label">Progress: ${book.progress}%</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${book.progress}%"></div>
                    </div>
                </div>
                
                ${book.notes ? `
                    <div class="book-notes">
                        <p>${this.escapeHtml(book.notes).substring(0, 100)}${book.notes.length > 100 ? '...' : ''}</p>
                    </div>
                ` : ''}
                
                <div class="book-actions">
                    <button class="btn btn-small btn-secondary" onclick="library.openModal(${JSON.stringify(book).replace(/"/g, '&quot;')})">
                        📝 Edit
                    </button>
                    <button class="btn btn-small btn-danger" onclick="library.deleteBook(${book.id})">
                        🗑️ Delete
                    </button>
                </div>
                
                <div class="book-meta">
                    <small>Added: ${new Date(book.dateAdded).toLocaleDateString()}</small>
                </div>
            </div>
        `).join('');
    }

    getFilteredBooks() {
        const categoryFilter = document.getElementById('categoryFilter').value;
        const statusFilter = document.getElementById('statusFilter').value;
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();

        return this.books.filter(book => {
            const matchesCategory = categoryFilter === 'all' || book.category === categoryFilter;
            const matchesStatus = statusFilter === 'all' || book.status === statusFilter;
            const matchesSearch = !searchTerm || 
                book.title.toLowerCase().includes(searchTerm) ||
                book.author.toLowerCase().includes(searchTerm) ||
                book.materialType.toLowerCase().includes(searchTerm) ||
                (book.notes && book.notes.toLowerCase().includes(searchTerm));

            return matchesCategory && matchesStatus && matchesSearch;
        });
    }

    updateStats() {
        const totalBooks = this.books.length;
        const readingBooks = this.books.filter(book => book.status === 'reading').length;
        const completedBooks = this.books.filter(book => book.status === 'completed').length;
        const toReadBooks = this.books.filter(book => book.status === 'to-read').length;

        document.getElementById('totalBooks').textContent = totalBooks;
        document.getElementById('readingBooks').textContent = readingBooks;
        document.getElementById('completedBooks').textContent = completedBooks;
        document.getElementById('toReadBooks').textContent = toReadBooks;
    }

    getStatusIcon(status) {
        const icons = {
            'to-read': '📋',
            'reading': '📖',
            'completed': '✅'
        };
        return icons[status] || '📄';
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    loadBooks() {
        const stored = localStorage.getItem('readingLibrary');
        return stored ? JSON.parse(stored) : [];
    }

    saveBooks() {
        localStorage.setItem('readingLibrary', JSON.stringify(this.books));
    }
}

// Initialize the library
const library = new ReadingLibrary();
