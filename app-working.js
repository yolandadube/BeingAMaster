// Simple Working Reading Library
console.log('JavaScript loading...');

class ReadingLibrary {
    constructor() {
        console.log('ReadingLibrary constructor called');
        this.books = JSON.parse(localStorage.getItem('readingLibrary')) || [];
        console.log('Loaded books from localStorage:', this.books.length, 'books');
        
        // Fix inconsistent status values
        this.normalizeBookStatuses();
        
        console.log('Books data:', this.books);
        this.currentEditId = null;
        this.currentFilter = 'all';
        this.currentSort = 'dateAdded';
        this.searchQuery = '';
        this.currentPage = 1;
        this.booksPerPage = 6;
        this.currentFilter = 'all';
        this.currentSort = 'dateAdded';
        this.searchQuery = '';
        this.currentPage = 1;
        this.booksPerPage = 6;
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    normalizeBookStatuses() {
        console.log('Normalizing book statuses...');
        let fixed = 0;
        
        this.books.forEach(book => {
            const oldStatus = book.status;
            
            // Normalize status values
            switch(book.status?.toLowerCase()) {
                case 'to read':
                case 'to-read':
                case 'toread':
                    book.status = 'To Read';
                    break;
                case 'reading':
                case 'currently reading':
                    book.status = 'Reading';
                    break;
                case 'completed':
                case 'finished':
                case 'done':
                    book.status = 'Completed';
                    break;
                case 'paused':
                case 'on hold':
                case 'stopped':
                    book.status = 'Paused';
                    break;
                default:
                    // Default to 'To Read' if status is missing or invalid
                    if (!book.status || !['To Read', 'Reading', 'Completed', 'Paused'].includes(book.status)) {
                        book.status = 'To Read';
                    }
            }
            
            if (oldStatus !== book.status) {
                console.log(`Fixed status: "${oldStatus}" → "${book.status}" for book "${book.title}"`);
                fixed++;
            }
        });
        
        if (fixed > 0) {
            console.log(`Fixed ${fixed} book statuses`);
            this.saveBooks();
        }
    }

    init() {
        console.log('=== INITIALIZING LIBRARY ===');
        this.renderBooks();
        this.updateStats();
        
        // Delay event listeners to ensure DOM is ready
        setTimeout(() => {
            this.setupEventListeners();
        }, 500);
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
        
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.currentPage = 1;
                this.renderBooks();
            });
        }
        
        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        console.log('Found filter buttons:', filterButtons.length);
        
        filterButtons.forEach(btn => {
            console.log('Setting up filter button:', btn.dataset.filter);
            btn.addEventListener('click', (e) => {
                console.log('Filter clicked:', e.target.dataset.filter);
                this.currentFilter = e.target.dataset.filter;
                this.currentPage = 1;
                
                // Update active state
                filterButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                console.log('Current filter set to:', this.currentFilter);
                this.renderBooks();
            });
        });
        
        // Sort dropdown
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                console.log('Sort changed:', e.target.value);
                this.currentSort = e.target.value;
                this.renderBooks();
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
        console.log('Rendering books... Current filter:', this.currentFilter);
        
        // Try multiple possible container IDs
        let container = document.getElementById('bookList');
        if (!container) {
            container = document.getElementById('booksContainer');
        }
        if (!container) {
            container = document.querySelector('.book-list');
        }
        
        if (!container) {
            console.error('No books container found');
            return;
        }
        
        // Filter books based on current filter and search
        let filteredBooks = this.books.filter(book => {
            // Ensure book has valid status
            if (!book.status || !['To Read', 'Reading', 'Completed', 'Paused'].includes(book.status)) {
                book.status = 'To Read';
            }
            
            const matchesFilter = this.currentFilter === 'all' || book.status === this.currentFilter;
            const matchesSearch = this.searchQuery === '' || 
                book.title.toLowerCase().includes(this.searchQuery) ||
                book.author.toLowerCase().includes(this.searchQuery) ||
                book.materialType.toLowerCase().includes(this.searchQuery) ||
                book.category.toLowerCase().includes(this.searchQuery);
            return matchesFilter && matchesSearch;
        });
        
        console.log('Filtered books:', filteredBooks.length);
        
        // Sort books
        filteredBooks.sort((a, b) => {
            switch (this.currentSort) {
                case 'title': return a.title.localeCompare(b.title);
                case 'author': return a.author.localeCompare(b.author);
                case 'progress': return b.progress - a.progress;
                case 'dateAdded': return new Date(b.dateAdded) - new Date(a.dateAdded);
                default: return 0;
            }
        });
        
        // Pagination
        const totalPages = Math.ceil(filteredBooks.length / this.booksPerPage);
        const startIndex = (this.currentPage - 1) * this.booksPerPage;
        const endIndex = startIndex + this.booksPerPage;
        const paginatedBooks = filteredBooks.slice(startIndex, endIndex);
        
        console.log('Filtered:', filteredBooks.length, 'Paginated:', paginatedBooks.length);

        if (filteredBooks.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>📚 No materials found</h3>
                    <p>${this.searchQuery ? 'Try a different search term' : this.currentFilter !== 'all' ? `No books with status "${this.currentFilter}"` : 'Click "Add New Material" to get started!'}</p>
                    ${this.searchQuery || this.currentFilter !== 'all' ? `<button class="btn btn-secondary" onclick="library.clearFilters();">Clear Filters</button>` : ''}
                </div>
            `;
            this.updatePagination(0, 0);
            return;
        }

        // Render books in grid format
        container.innerHTML = `
            <div class="books-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; width: 100%;">
                ${paginatedBooks.map(book => `
                    <div class="book-card" data-id="${book.id}" style="background: var(--card-bg); border: 1px solid var(--border); border-radius: 12px; padding: 20px; display: flex; flex-direction: column; min-height: 400px;">
                        <div class="book-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px; gap: 10px;">
                            <h3 class="book-title" style="color: var(--gold); margin: 0; font-size: 1.1em; font-weight: 600; flex: 1; line-height: 1.3;">${book.title}</h3>
                            <div class="book-status status-${book.status.toLowerCase().replace(' ', '-')}" style="padding: 4px 8px; border-radius: 12px; font-size: 0.8em; font-weight: 600; white-space: nowrap; background: rgba(108, 117, 125, 0.2); color: #6c757d;">${this.getStatusIcon(book.status)} ${book.status}</div>
                        </div>
                        <div class="book-info" style="margin-bottom: 15px;">
                            <p class="author" style="color: var(--text-secondary); font-style: italic; margin: 0 0 8px 0;">👤 ${book.author}</p>
                            <p class="material-info" style="display: flex; justify-content: space-between; margin: 8px 0; flex-wrap: wrap; gap: 8px;">
                                <span class="material-type" style="color: var(--text-secondary); font-size: 0.85em;">📖 ${book.materialType}</span>
                                <span class="category" style="color: var(--text-secondary); font-size: 0.85em;">🏷️ ${book.category}</span>
                            </p>
                            ${book.materialLink ? `<a href="${book.materialLink}" target="_blank" class="material-link" style="display: inline-block; color: var(--gold); text-decoration: none; font-weight: 500; margin: 8px 0;">🔗 Open Material</a>` : ''}
                        </div>
                        
                        <div class="progress-section" style="margin: 15px 0; padding: 12px; background: rgba(212, 175, 55, 0.1); border-radius: 8px; border: 1px solid rgba(212, 175, 55, 0.3);">
                            <div class="progress-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <span class="progress-text" style="font-weight: 600; color: var(--gold);">Progress: ${book.progress}%</span>
                                <div class="progress-controls" style="display: flex; gap: 5px;">
                                    <button class="btn-mini" onclick="library.updateProgress(${book.id}, ${Math.max(0, book.progress - 10)})" title="-10%" style="background: var(--gold); color: var(--primary-bg); border: none; border-radius: 4px; width: 24px; height: 24px; cursor: pointer; font-weight: bold; font-size: 14px;">−</button>
                                    <button class="btn-mini" onclick="library.updateProgress(${book.id}, ${Math.min(100, book.progress + 10)})" title="+10%" style="background: var(--gold); color: var(--primary-bg); border: none; border-radius: 4px; width: 24px; height: 24px; cursor: pointer; font-weight: bold; font-size: 14px;">+</button>
                                </div>
                            </div>
                            <div class="progress-bar" style="width: 100%; height: 8px; background: rgba(255, 255, 255, 0.1); border-radius: 4px; overflow: hidden; margin: 8px 0;">
                                <div class="progress-fill" style="height: 100%; background: linear-gradient(90deg, var(--gold), #f4d03f); border-radius: 4px; transition: width 0.3s ease; width: ${book.progress}%;"></div>
                            </div>
                            <input type="range" class="progress-slider" min="0" max="100" value="${book.progress}" 
                                   onchange="library.updateProgress(${book.id}, this.value)" style="width: 100%; margin: 8px 0 4px 0; cursor: pointer;">
                        </div>
                        
                        <div class="status-controls" style="margin: 15px 0;">
                            <select class="status-select" onchange="library.quickStatusChange(${book.id}, this.value)" style="width: 100%; padding: 8px; background: var(--input-bg); border: 1px solid var(--border); border-radius: 6px; color: var(--text-primary); cursor: pointer;">
                                <option value="To Read" ${book.status === 'To Read' ? 'selected' : ''}>📚 To Read</option>
                                <option value="Reading" ${book.status === 'Reading' ? 'selected' : ''}>📖 Reading</option>
                                <option value="Completed" ${book.status === 'Completed' ? 'selected' : ''}>✅ Completed</option>
                                <option value="Paused" ${book.status === 'Paused' ? 'selected' : ''}>⏸️ Paused</option>
                            </select>
                        </div>
                        
                        ${book.notes ? `<div class="notes" style="background: rgba(255, 255, 255, 0.05); padding: 10px; border-radius: 6px; margin: 12px 0; font-style: italic; border-left: 3px solid var(--gold); font-size: 0.9em;">💭 ${book.notes}</div>` : ''}
                        
                        <div class="book-meta" style="display: flex; justify-content: space-between; margin: 10px 0; font-size: 0.8em; color: var(--text-secondary); flex-wrap: wrap; gap: 8px;">
                            <span class="date">📅 ${book.dateAdded}</span>
                            ${book.lastRead ? `<span class="last-read" style="color: var(--gold);">🕒 ${book.lastRead}</span>` : ''}
                        </div>
                        
                        <div class="book-actions" style="display: flex; gap: 8px; margin-top: auto; padding-top: 15px; border-top: 1px solid var(--border);">
                            <button class="btn btn-sm btn-primary" onclick="library.quickStartReading(${book.id})" title="Quick Action" style="padding: 6px 12px; font-size: 0.85em; border-radius: 6px; border: none; cursor: pointer; font-weight: 500; background: var(--gold); color: var(--primary-bg);">⚡ ${this.getQuickActionText(book)}</button>
                            <button class="btn btn-sm btn-secondary" onclick="library.editBook(${book.id})" style="padding: 6px 12px; font-size: 0.85em; border-radius: 6px; border: none; cursor: pointer; font-weight: 500; background: rgba(255, 255, 255, 0.1); color: var(--text-primary); border: 1px solid var(--border);">✏️ Edit</button>
                            <button class="btn btn-sm btn-danger" onclick="library.deleteBook(${book.id})" style="padding: 6px 12px; font-size: 0.85em; border-radius: 6px; border: none; cursor: pointer; font-weight: 500; background: rgba(220, 53, 69, 0.2); color: #ff6b6b; border: 1px solid rgba(220, 53, 69, 0.3);">🗑️ Delete</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        this.updatePagination(filteredBooks.length, totalPages);
    }

    updateStats() {
        console.log('Updating stats. Total books:', this.books.length);
        
        // Count by exact status values
        const statusCounts = {
            'To Read': 0,
            'Reading': 0, 
            'Completed': 0,
            'Paused': 0
        };
        
        this.books.forEach(book => {
            if (statusCounts.hasOwnProperty(book.status)) {
                statusCounts[book.status]++;
            } else {
                console.warn('Unknown status found:', book.status, 'for book:', book.title);
                // Auto-fix unknown status
                book.status = 'To Read';
                statusCounts['To Read']++;
            }
        });
        
        console.log('Status counts:', statusCounts);
        
        const totalElement = document.getElementById('totalBooks');
        const readingElement = document.getElementById('readingBooks');
        const completedElement = document.getElementById('completedBooks');
        const toReadElement = document.getElementById('toReadBooks');
        
        if (totalElement) totalElement.textContent = this.books.length;
        if (toReadElement) toReadElement.textContent = statusCounts['To Read'];
        if (readingElement) readingElement.textContent = statusCounts['Reading'];
        if (completedElement) completedElement.textContent = statusCounts['Completed'];
        
        console.log('Stats updated:', {
            total: this.books.length,
            toRead: statusCounts['To Read'],
            reading: statusCounts['Reading'],
            completed: statusCounts['Completed'],
            paused: statusCounts['Paused']
        });
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
    
    getStatusIcon(status) {
        const icons = {
            'To Read': '📚',
            'Reading': '📖', 
            'Completed': '✅',
            'Paused': '⏸️'
        };
        return icons[status] || '📖';
    }
    
    getQuickActionText(book) {
        switch(book.status) {
            case 'To Read': return 'Start';
            case 'Reading': return 'Continue';
            case 'Completed': return 'Review';
            case 'Paused': return 'Resume';
            default: return 'Read';
        }
    }
    
    updatePagination(totalItems, totalPages) {
        const paginationContainer = document.getElementById('pagination');
        if (!paginationContainer) return;
        
        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }
        
        let paginationHTML = `
            <div class="pagination-info">
                Showing ${((this.currentPage - 1) * this.booksPerPage) + 1}-${Math.min(this.currentPage * this.booksPerPage, totalItems)} of ${totalItems} materials
            </div>
            <div class="pagination-controls">
                <button class="btn btn-sm ${this.currentPage === 1 ? 'disabled' : ''}" 
                        onclick="library.changePage(${this.currentPage - 1})" 
                        ${this.currentPage === 1 ? 'disabled' : ''}>‹ Previous</button>
        `;
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === this.currentPage || i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                paginationHTML += `<button class="btn btn-sm ${i === this.currentPage ? 'btn-primary' : 'btn-secondary'}" onclick="library.changePage(${i})">${i}</button>`;
            } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                paginationHTML += '<span class="pagination-ellipsis">...</span>';
            }
        }
        
        paginationHTML += `
                <button class="btn btn-sm ${this.currentPage === totalPages ? 'disabled' : ''}" 
                        onclick="library.changePage(${this.currentPage + 1})" 
                        ${this.currentPage === totalPages ? 'disabled' : ''}>Next ›</button>
            </div>
        `;
        
        paginationContainer.innerHTML = paginationHTML;
    }
    
    changePage(newPage) {
        this.currentPage = newPage;
        this.renderBooks();
        document.querySelector('.book-list').scrollIntoView({ behavior: 'smooth' });
    }
    
    clearFilters() {
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.currentPage = 1;
        
        // Reset search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = '';
        
        // Reset filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === 'all') {
                btn.classList.add('active');
            }
        });
        
        this.renderBooks();
    }
}

// Initialize the library
console.log('Creating ReadingLibrary instance...');
window.library = new ReadingLibrary();
console.log('Library created:', !!window.library);