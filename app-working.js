// Simple Working Reading Library
console.log('JavaScript loading...');

class ReadingLibrary {
    constructor() {
        console.log('ReadingLibrary constructor called');
        this.books = JSON.parse(localStorage.getItem('readingLibrary')) || [];
        console.log('Loaded books from localStorage:', this.books.length, 'books');
        console.log('Books data:', this.books);
        this.currentEditId = null;
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        console.log('=== INITIALIZING LIBRARY ===');
        this.setupEventListeners();
        this.renderBooks();
        this.updateStats();
    }

    setupEventListeners() {
        console.log('=== SETTING UP EVENT LISTENERS ===');
        
        // Add material button
        const addBtn = document.getElementById('addBookBtn');
        console.log('Add button found:', !!addBtn);
        
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                console.log('=== ADD BUTTON CLICKED ===');
                this.openModal();
            });
        }

        // Form submission
        const form = document.getElementById('bookForm');
        console.log('Form found:', !!form);
        
        if (form) {
            form.addEventListener('submit', (e) => {
                console.log('=== FORM SUBMITTED ===');
                e.preventDefault();
                this.saveBook();
                return false;
            });
        }

        // Cancel button
        const cancelBtn = document.getElementById('cancelBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                console.log('Cancel clicked');
                this.closeModal();
            });
        }

        // Close modal when clicking outside
        const modal = document.getElementById('bookModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }
    }

    openModal() {
        console.log('=== OPENING MODAL ===');
        const modal = document.getElementById('bookModal');
        const form = document.getElementById('bookForm');
        
        if (modal && form) {
            // Reset form
            form.reset();
            this.currentEditId = null;
            
            // Show modal
            modal.style.display = 'block';
            console.log('Modal opened successfully');
        } else {
            console.error('Modal or form not found!');
        }
    }

    closeModal() {
        console.log('=== CLOSING MODAL ===');
        const modal = document.getElementById('bookModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    saveBook() {
        console.log('=== SAVE BOOK CALLED ===');
        
        // Get form data
        const title = document.getElementById('bookTitle')?.value?.trim();
        const author = document.getElementById('bookAuthor')?.value?.trim();
        const materialType = document.getElementById('materialType')?.value || 'Book';
        const materialLink = document.getElementById('materialLink')?.value?.trim();
        const category = document.getElementById('bookCategory')?.value || 'Personal Development';
        const status = document.getElementById('bookStatus')?.value || 'To Read';
        const progress = parseInt(document.getElementById('bookProgress')?.value || 0);
        const notes = document.getElementById('bookNotes')?.value?.trim();

        console.log('Form data:', { title, author, materialType, category, status, progress });

        // Validate required fields
        if (!title || !author) {
            alert('Please fill in both title and author fields.');
            return;
        }

        // Create book object
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
            dateAdded: this.currentEditId ? this.books.find(b => b.id === this.currentEditId)?.dateAdded : new Date().toLocaleDateString(),
            lastRead: this.currentEditId ? new Date().toLocaleDateString() : null
        };

        console.log('Book object created:', book);

        // Add or update book
        if (this.currentEditId) {
            const index = this.books.findIndex(b => b.id === this.currentEditId);
            if (index !== -1) {
                this.books[index] = book;
                console.log('Book updated');
            }
        } else {
            this.books.push(book);
            console.log('New book added');
        }

        // Save and refresh
        this.saveBooks();
        
        // Small delay to ensure DOM is stable
        setTimeout(() => {
            this.renderBooks();
            this.updateStats();
        }, 100);
        
        this.closeModal();
        
        console.log('=== SAVE COMPLETED ===');
    }

    renderBooks() {
        console.log('Rendering books...');
        console.log('Number of books to render:', this.books.length);
        
        // Try multiple possible container IDs
        let container = document.getElementById('bookList');
        if (!container) {
            container = document.getElementById('booksContainer');
        }
        if (!container) {
            container = document.querySelector('.book-list');
        }
        
        console.log('Container search results:', {
            bookList: !!document.getElementById('bookList'),
            booksContainer: !!document.getElementById('booksContainer'),
            querySelector: !!document.querySelector('.book-list')
        });
        
        if (!container) {
            console.error('No books container found with any method');
            return;
        }
        console.log('Container found:', container);

        if (this.books.length === 0) {
            container.innerHTML = '<div class="empty-state">No materials added yet. Click "Add New Material" to get started!</div>';
            console.log('Showing empty state');
            return;
        }

        console.log('Rendering', this.books.length, 'books');

        container.innerHTML = this.books.map(book => `
            <div class="book-card" data-id="${book.id}">
                <div class="book-info">
                    <h3>${book.title}</h3>
                    <p class="author">by ${book.author}</p>
                    <p class="material-type">${book.materialType}</p>
                    ${book.materialLink ? `<p class="material-link"><a href="${book.materialLink}" target="_blank">📖 View Material</a></p>` : ''}
                    <p class="category">📂 ${book.category}</p>
                    <div class="status-section">
                        <span class="status-label">Status:</span>
                        <select class="status-select" onchange="library.quickStatusChange(${book.id}, this.value)">
                            <option value="To Read" ${book.status === 'To Read' ? 'selected' : ''}>📚 To Read</option>
                            <option value="Reading" ${book.status === 'Reading' ? 'selected' : ''}>📖 Reading</option>
                            <option value="Completed" ${book.status === 'Completed' ? 'selected' : ''}>✅ Completed</option>
                            <option value="Paused" ${book.status === 'Paused' ? 'selected' : ''}>⏸️ Paused</option>
                        </select>
                    </div>
                    <div class="progress-section">
                        <div class="progress-header">
                            <span>Progress: ${book.progress}%</span>
                            <div class="progress-controls">
                                <button class="btn-mini" onclick="library.updateProgress(${book.id}, ${Math.max(0, book.progress - 10)})" title="-10%">−</button>
                                <button class="btn-mini" onclick="library.updateProgress(${book.id}, ${Math.min(100, book.progress + 10)})" title="+10%">+</button>
                            </div>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${book.progress}%"></div>
                        </div>
                        <input type="range" class="progress-slider" min="0" max="100" value="${book.progress}" 
                               onchange="library.updateProgress(${book.id}, this.value)" 
                               oninput="this.nextElementSibling.textContent = this.value + '%'">
                        <span class="progress-value">${book.progress}%</span>
                    </div>
                    ${book.notes ? `<p class="notes">💭 ${book.notes}</p>` : ''}
                    <p class="date">📅 Added: ${book.dateAdded}</p>
                    ${book.lastRead ? `<p class="last-read">🕒 Last updated: ${book.lastRead}</p>` : ''}
                </div>
                <div class="book-actions">
                    <button class="btn btn-sm btn-primary" onclick="library.quickStartReading(${book.id})" title="Start/Continue Reading">📖 Read</button>
                    <button class="btn btn-sm btn-secondary" onclick="library.editBook(${book.id})">✏️ Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="library.deleteBook(${book.id})">🗑️ Delete</button>
                </div>
            </div>
        `).join('');
    }

    updateStats() {
        const totalElement = document.getElementById('totalBooks');
        const readingElement = document.getElementById('readingBooks');
        const completedElement = document.getElementById('completedBooks');
        const toReadElement = document.getElementById('toReadBooks');

        if (totalElement) totalElement.textContent = this.books.length;
        if (readingElement) readingElement.textContent = this.books.filter(b => b.status === 'Reading').length;
        if (completedElement) completedElement.textContent = this.books.filter(b => b.status === 'Completed').length;
        if (toReadElement) toReadElement.textContent = this.books.filter(b => b.status === 'To Read').length;
    }

    editBook(id) {
        console.log('Editing book:', id);
        const book = this.books.find(b => b.id === id);
        if (!book) return;

        this.currentEditId = id;
        
        // Fill form with book data
        document.getElementById('bookTitle').value = book.title || '';
        document.getElementById('bookAuthor').value = book.author || '';
        document.getElementById('materialType').value = book.materialType || 'Book';
        document.getElementById('materialLink').value = book.materialLink || '';
        document.getElementById('bookCategory').value = book.category || 'Personal Development';
        document.getElementById('bookStatus').value = book.status || 'To Read';
        document.getElementById('bookProgress').value = book.progress || 0;
        document.getElementById('bookNotes').value = book.notes || '';

        // Update progress display
        const progressValue = document.getElementById('progressValue');
        if (progressValue) {
            progressValue.textContent = book.progress || 0;
        }

        this.openModal();
    }

    quickStatusChange(id, newStatus) {
        console.log(`Changing status for book ${id} to ${newStatus}`);
        const book = this.books.find(b => b.id === id);
        if (!book) return;
        
        const oldStatus = book.status;
        book.status = newStatus;
        book.lastRead = new Date().toLocaleDateString();
        
        // Auto-update progress based on status
        if (newStatus === 'Reading' && oldStatus === 'To Read' && book.progress === 0) {
            book.progress = 5; // Started reading
        } else if (newStatus === 'Completed') {
            book.progress = 100;
        } else if (newStatus === 'To Read') {
            book.progress = 0;
        }
        
        this.saveBooks();
        this.renderBooks();
        this.updateStats();
        
        // Show feedback
        this.showToast(`📚 "${book.title}" status changed to ${newStatus}`);
    }
    
    updateProgress(id, newProgress) {
        console.log(`Updating progress for book ${id} to ${newProgress}%`);
        const book = this.books.find(b => b.id === id);
        if (!book) return;
        
        book.progress = parseInt(newProgress);
        book.lastRead = new Date().toLocaleDateString();
        
        // Auto-update status based on progress
        if (book.progress === 100 && book.status !== 'Completed') {
            book.status = 'Completed';
        } else if (book.progress > 0 && book.progress < 100 && book.status === 'To Read') {
            book.status = 'Reading';
        } else if (book.progress === 0 && book.status === 'Reading') {
            book.status = 'To Read';
        }
        
        this.saveBooks();
        this.renderBooks();
        this.updateStats();
    }
    
    quickStartReading(id) {
        const book = this.books.find(b => b.id === id);
        if (!book) return;
        
        if (book.status === 'To Read') {
            this.quickStatusChange(id, 'Reading');
            this.showToast(`📖 Started reading "${book.title}"`);
        } else if (book.status === 'Reading') {
            // Quick progress increment
            const newProgress = Math.min(100, book.progress + 10);
            this.updateProgress(id, newProgress);
            this.showToast(`📈 Progress updated: ${newProgress}%`);
        } else if (book.status === 'Completed') {
            this.showToast(`✅ "${book.title}" is already completed!`);
        }
    }
    
    showToast(message) {
        // Simple toast notification
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--gold);
            color: var(--primary-bg);
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 1000;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    deleteBook(id) {
        if (confirm('Are you sure you want to delete this material?')) {
            this.books = this.books.filter(b => b.id !== id);
            this.saveBooks();
            this.renderBooks();
            this.updateStats();
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

// Initialize the library
console.log('Creating ReadingLibrary instance...');
window.library = new ReadingLibrary();
console.log('Library created:', !!window.library);