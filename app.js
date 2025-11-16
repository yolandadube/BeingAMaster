// Academic Research Library - Fixed JavaScript

class ReadingLibrary {
    constructor() {
        this.books = this.loadBooks();
        this.currentEditId = null;
        
        // Wait for DOM to load before initializing
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        console.log('Initializing Reading Library...');
        this.setupEventListeners();
        this.renderBooks();
        this.updateStats();
    }

    setupEventListeners() {
        // Add material button
        const addBtn = document.getElementById('addBookBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                console.log('Add button clicked');
                this.openModal();
            });
        }

        // Modal close button
        const closeBtn = document.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeModal();
            });
        }

        // Cancel button
        const cancelBtn = document.getElementById('cancelBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.closeModal();
            });
        }

        // Click outside modal to close
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('bookModal');
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // Form submit - This is the key fix!
        const form = document.getElementById('bookForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Form submitted');
                this.saveBook();
                return false;
            });
        }

        // Progress slider
        const progressSlider = document.getElementById('bookProgress');
        if (progressSlider) {
            progressSlider.addEventListener('input', (e) => {
                const progressValue = document.getElementById('progressValue');
                if (progressValue) {
                    progressValue.textContent = e.target.value;
                }
            });
        }

        // Status change updates progress
        const statusSelect = document.getElementById('bookStatus');
        if (statusSelect) {
            statusSelect.addEventListener('change', (e) => {
                const progressSlider = document.getElementById('bookProgress');
                const progressValue = document.getElementById('progressValue');
                
                if (progressSlider && progressValue) {
                    if (e.target.value === 'completed') {
                        progressSlider.value = 100;
                    } else if (e.target.value === 'to-read') {
                        progressSlider.value = 0;
                    }
                    progressValue.textContent = progressSlider.value;
                }
            });
        }

        // Filters
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                this.renderBooks();
            });
        }

        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', () => {
                this.renderBooks();
            });
        }

        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                this.renderBooks();
            });
        }
    }

    openModal(book = null) {
        const modal = document.getElementById('bookModal');
        const modalTitle = document.getElementById('modalTitle');
        const form = document.getElementById('bookForm');

        if (!modal || !modalTitle || !form) {
            console.error('Modal elements not found');
            return;
        }

        if (book) {
            // Edit mode
            this.currentEditId = book.id;
            modalTitle.textContent = 'Edit Material';
            
            const titleInput = document.getElementById('bookTitle');
            const authorInput = document.getElementById('bookAuthor');
            const typeSelect = document.getElementById('materialType');
            const linkInput = document.getElementById('materialLink');
            const categorySelect = document.getElementById('bookCategory');
            const statusSelect = document.getElementById('bookStatus');
            const progressSlider = document.getElementById('bookProgress');
            const progressValue = document.getElementById('progressValue');
            const notesTextarea = document.getElementById('bookNotes');

            if (titleInput) titleInput.value = book.title || '';
            if (authorInput) authorInput.value = book.author || '';
            if (typeSelect) typeSelect.value = book.materialType || 'Book';
            if (linkInput) linkInput.value = book.materialLink || '';
            if (categorySelect) categorySelect.value = book.category || '';
            if (statusSelect) statusSelect.value = book.status || '';
            if (progressSlider) progressSlider.value = book.progress || 0;
            if (progressValue) progressValue.textContent = book.progress || 0;
            if (notesTextarea) notesTextarea.value = book.notes || '';
        } else {
            // Add mode
            this.currentEditId = null;
            modalTitle.textContent = 'Add New Material';
            form.reset();
            
            const progressValue = document.getElementById('progressValue');
            if (progressValue) {
                progressValue.textContent = '0';
            }
        }

        modal.style.display = 'block';
        
        // Focus first input for better UX
        setTimeout(() => {
            const titleInput = document.getElementById('bookTitle');
            if (titleInput) {
                titleInput.focus();
            }
        }, 100);
    }

    closeModal() {
        const modal = document.getElementById('bookModal');
        const form = document.getElementById('bookForm');
        const progressValue = document.getElementById('progressValue');
        
        if (modal) modal.style.display = 'none';
        this.currentEditId = null;
        if (form) form.reset();
        if (progressValue) progressValue.textContent = '0';
    }

    saveBook() {
        console.log('saveBook called');
        
        // Get form elements safely
        const titleInput = document.getElementById('bookTitle');
        const authorInput = document.getElementById('bookAuthor');
        const typeSelect = document.getElementById('materialType');
        const linkInput = document.getElementById('materialLink');
        const categorySelect = document.getElementById('bookCategory');
        const statusSelect = document.getElementById('bookStatus');
        const progressSlider = document.getElementById('bookProgress');
        const notesTextarea = document.getElementById('bookNotes');

        if (!titleInput || !authorInput || !typeSelect || !categorySelect || !statusSelect || !progressSlider) {
            alert('Error: Form elements not found. Please refresh the page.');
            return;
        }

        const title = titleInput.value.trim();
        const author = authorInput.value.trim();
        const materialType = typeSelect.value;
        const materialLink = linkInput ? linkInput.value.trim() : '';
        const category = categorySelect.value;
        const status = statusSelect.value;
        const progress = parseInt(progressSlider.value) || 0;
        const notes = notesTextarea ? notesTextarea.value.trim() : '';

        // Validation
        if (!title || !author || !materialType || !category || !status) {
            alert('Please fill in all required fields:\n- Title\n- Author\n- Material Type\n- Category\n- Reading Status');
            return;
        }

        console.log('Creating book object:', { title, author, materialType, category, status });

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
                (this.books.find(b => b.id === this.currentEditId)?.dateAdded || new Date().toISOString()) : 
                new Date().toISOString(),
            dateModified: new Date().toISOString()
        };

        if (this.currentEditId) {
            // Update existing
            const index = this.books.findIndex(b => b.id === this.currentEditId);
            if (index !== -1) {
                this.books[index] = book;
                console.log('Updated existing book');
            }
        } else {
            // Add new
            this.books.push(book);
            console.log('Added new book');
        }

        this.saveBooks();
        this.renderBooks();
        this.updateStats();
        this.closeModal();
        
        console.log('Book saved successfully');
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

        if (!booksGrid || !emptyState) {
            console.error('Books grid or empty state element not found');
            return;
        }

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
                    <button class="btn btn-small btn-secondary" onclick="window.library.openModal(${JSON.stringify(book).replace(/"/g, '&quot;')})">
                        📝 Edit
                    </button>
                    <button class="btn btn-small btn-danger" onclick="window.library.deleteBook(${book.id})">
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
        const categoryFilter = document.getElementById('categoryFilter');
        const statusFilter = document.getElementById('statusFilter');
        const searchInput = document.getElementById('searchInput');

        const categoryValue = categoryFilter ? categoryFilter.value : 'all';
        const statusValue = statusFilter ? statusFilter.value : 'all';
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';

        return this.books.filter(book => {
            const matchesCategory = categoryValue === 'all' || book.category === categoryValue;
            const matchesStatus = statusValue === 'all' || book.status === statusValue;
            const matchesSearch = !searchTerm || 
                book.title.toLowerCase().includes(searchTerm) ||
                book.author.toLowerCase().includes(searchTerm) ||
                (book.materialType && book.materialType.toLowerCase().includes(searchTerm)) ||
                (book.notes && book.notes.toLowerCase().includes(searchTerm));

            return matchesCategory && matchesStatus && matchesSearch;
        });
    }

    updateStats() {
        const totalBooks = this.books.length;
        const readingBooks = this.books.filter(book => book.status === 'reading').length;
        const completedBooks = this.books.filter(book => book.status === 'completed').length;
        const toReadBooks = this.books.filter(book => book.status === 'to-read').length;

        const totalElement = document.getElementById('totalBooks');
        const readingElement = document.getElementById('readingBooks');
        const completedElement = document.getElementById('completedBooks');
        const toReadElement = document.getElementById('toReadBooks');

        if (totalElement) totalElement.textContent = totalBooks;
        if (readingElement) readingElement.textContent = readingBooks;
        if (completedElement) completedElement.textContent = completedBooks;
        if (toReadElement) toReadElement.textContent = toReadBooks;
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
        div.textContent = text || '';
        return div.innerHTML;
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
            console.log('Books saved to localStorage');
        } catch (error) {
            console.error('Error saving books:', error);
        }
    }
}

// Initialize the library and make it globally available
window.library = new ReadingLibrary();