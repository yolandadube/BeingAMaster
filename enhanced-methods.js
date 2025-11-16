// Enhanced methods for the reading library

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
    
    if (!container) {
        console.error('No books container found with any method');
        return;
    }
    
    // Filter books based on current filter and search
    let filteredBooks = this.books.filter(book => {
        const matchesFilter = this.currentFilter === 'all' || book.status === this.currentFilter;
        const matchesSearch = this.searchQuery === '' || 
            book.title.toLowerCase().includes(this.searchQuery) ||
            book.author.toLowerCase().includes(this.searchQuery) ||
            book.materialType.toLowerCase().includes(this.searchQuery) ||
            book.category.toLowerCase().includes(this.searchQuery);
        return matchesFilter && matchesSearch;
    });
    
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
                <p>${this.searchQuery ? 'Try a different search term' : 'Click "Add New Material" to get started!'}</p>
                ${this.searchQuery ? `<button class="btn btn-secondary" onclick="document.getElementById('searchInput').value=''; library.searchQuery=''; library.renderBooks();">Clear Search</button>` : ''}
            </div>
        `;
        this.updatePagination(0, 0);
        return;
    }

    // Render books in grid format
    container.innerHTML = `
        <div class="books-grid">
            ${paginatedBooks.map(book => `
                <div class="book-card" data-id="${book.id}">
                    <div class="book-header">
                        <h3 class="book-title">${book.title}</h3>
                        <div class="book-status status-${book.status.toLowerCase().replace(' ', '-')}">${this.getStatusIcon(book.status)} ${book.status}</div>
                    </div>
                    <div class="book-info">
                        <p class="author">👤 ${book.author}</p>
                        <p class="material-info">
                            <span class="material-type">📖 ${book.materialType}</span>
                            <span class="category">🏷️ ${book.category}</span>
                        </p>
                        ${book.materialLink ? `<a href="${book.materialLink}" target="_blank" class="material-link">🔗 Open Material</a>` : ''}
                    </div>
                    
                    <div class="progress-section">
                        <div class="progress-header">
                            <span class="progress-text">Progress: ${book.progress}%</span>
                            <div class="progress-controls">
                                <button class="btn-mini" onclick="library.updateProgress(${book.id}, ${Math.max(0, book.progress - 10)})" title="-10%">−</button>
                                <button class="btn-mini" onclick="library.updateProgress(${book.id}, ${Math.min(100, book.progress + 10)})" title="+10%">+</button>
                            </div>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${book.progress}%"></div>
                        </div>
                        <input type="range" class="progress-slider" min="0" max="100" value="${book.progress}" 
                               onchange="library.updateProgress(${book.id}, this.value)">
                    </div>
                    
                    <div class="status-controls">
                        <select class="status-select" onchange="library.quickStatusChange(${book.id}, this.value)">
                            <option value="To Read" ${book.status === 'To Read' ? 'selected' : ''}>📚 To Read</option>
                            <option value="Reading" ${book.status === 'Reading' ? 'selected' : ''}>📖 Reading</option>
                            <option value="Completed" ${book.status === 'Completed' ? 'selected' : ''}>✅ Completed</option>
                            <option value="Paused" ${book.status === 'Paused' ? 'selected' : ''}>⏸️ Paused</option>
                        </select>
                    </div>
                    
                    ${book.notes ? `<div class="notes">💭 ${book.notes}</div>` : ''}
                    
                    <div class="book-meta">
                        <span class="date">📅 ${book.dateAdded}</span>
                        ${book.lastRead ? `<span class="last-read">🕒 ${book.lastRead}</span>` : ''}
                    </div>
                    
                    <div class="book-actions">
                        <button class="btn btn-sm btn-primary" onclick="library.quickStartReading(${book.id})" title="Quick Action">⚡ ${this.getQuickActionText(book)}</button>
                        <button class="btn btn-sm btn-secondary" onclick="library.editBook(${book.id})">✏️ Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="library.deleteBook(${book.id})">🗑️ Delete</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    this.updatePagination(filteredBooks.length, totalPages);
}