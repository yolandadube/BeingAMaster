# BeingAMaster - Personal Reading Library

A personal reading library application to track and manage your reading journey across Philosophy, Religion, Mathematics, Science, and Cosmology.

## Features

- 📚 **Personal Library Management**: Add, edit, and delete books in your personal collection
- 📊 **Progress Tracking**: Track reading progress with percentage completion for each book
- 🏷️ **Category Organization**: Organize books by category (Philosophy, Religion, Mathematics, Science, Cosmology)
- 📈 **Reading Status**: Track books as "To Read", "Reading", or "Completed"
- 🔍 **Search & Filter**: Easily find books by title, author, or notes
- 📝 **Notes**: Add personal notes for each book
- 📱 **Responsive Design**: Works beautifully on desktop, tablet, and mobile devices
- 🔒 **Private & Local**: All data is stored locally in your browser - only you have access

## How to Use

1. **Open the Application**: Simply open `index.html` in your web browser
2. **Add Books**: Click the "Add New Book" button to add books to your library
3. **Track Progress**: Use the progress slider to track how far you've read
4. **Filter & Search**: Use the filters and search bar to find specific books
5. **Edit or Delete**: Click the "Edit" or "Delete" buttons on any book card

## Getting Started

### Option 1: Open Directly
1. Download or clone this repository
2. Open `index.html` in any modern web browser
3. Start adding your books!

### Option 2: Local Server (Optional)
```bash
# If you have Python installed
python -m http.server 8000

# Or with Node.js
npx http-server
```
Then open `http://localhost:8000` in your browser.

## Data Storage

All your data is stored locally in your browser using localStorage. This means:
- ✅ Your data is private and never leaves your computer
- ✅ No internet connection required after first load
- ✅ No account or login needed
- ⚠️ Clearing your browser data will delete your library
- 💡 Backup tip: Use your browser's developer tools to export localStorage data

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript
- localStorage API

## Browser Compatibility

Works on all modern browsers that support:
- localStorage
- ES6+ JavaScript
- CSS Grid and Flexbox

## License

This is a personal project. Feel free to use and modify as needed.
