# Yolymatics Learning Hub

A beautiful, full-stack web application designed for scholars who deeply study Christianity, Philosophy, Mathematics, Physics, and Cosmology. This personal knowledge management system features an elegant black and gold theme with powerful tools for managing your learning journey.

## ✨ Features

### 📚 Reading List Manager
- Track books in three categories: **Currently Reading**, **Finished**, and **Read Later**
- Visual progress tracking with progress bars
- Store detailed information: author, subject, difficulty level, notes, quotes, and tags
- Filter and search capabilities
- Support for PDF uploads and book links

### 📖 Library
- Organized collection of all your books and documents
- Filter by subject area
- Search by title, author, or tags
- PDF preview support (planned)
- Metadata management

### 📝 Study Notes System
- Powerful markdown editor with live preview
- **Math support** using KaTeX for beautiful equation rendering
- Syntax highlighting for code blocks
- Tagging system for organization
- Note linking support (backlinks planned)
- Organized by subject areas

### 🏠 Dashboard
- Quick overview of your learning progress
- Reading statistics
- Currently reading books with progress
- Pending tasks
- Daily Bible verse (for Christianity studies)
- Motivational quotes

### 🎓 Subject-Specific Pages
Each of the five subjects has its dedicated page:

- **Christianity**: Bible reading plan, reflections, sermons, verse highlights
- **Philosophy**: Key concepts, thought of the day
- **Mathematics**: Study topics, beautiful equations
- **Physics**: Fields of study, fundamental equations, derivations
- **Cosmology**: Research areas, cosmological parameters, MCMC analysis logs, papers list

## 🎨 Design

- **Theme**: Elegant black background with gold accents
- **UI Style**: Minimalistic, academic, professional
- **Responsive**: Optimized for desktop usage
- **Smooth Interactions**: Hover effects, transitions, and polished UI elements

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS 4
- **Markdown**: react-markdown with remark-math and remark-gfm
- **Math Rendering**: KaTeX via rehype-katex
- **Icons**: Lucide React
- **Data Storage**: LocalStorage (demo) - can be upgraded to Supabase/Firebase

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yolandadube/BeingAMaster.git
cd BeingAMaster
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
BeingAMaster/
├── app/                          # Next.js app directory
│   ├── dashboard/               # Dashboard page
│   ├── reading/                 # Reading list manager
│   ├── library/                 # Book library
│   ├── notes/                   # Study notes system
│   ├── subjects/                # Subject-specific pages
│   │   ├── christianity/
│   │   ├── philosophy/
│   │   ├── mathematics/
│   │   ├── physics/
│   │   └── cosmology/
│   ├── layout.tsx               # Root layout with navigation
│   └── globals.css              # Global styles and theme
├── components/                   # Reusable components
│   ├── layout/                  # Layout components
│   │   └── Navigation.tsx       # Sidebar navigation
│   ├── ui/                      # UI components
│   │   ├── Card.tsx
│   │   └── Button.tsx
│   └── subjects/                # Subject components
│       └── SubjectLayout.tsx
├── lib/                         # Utilities and types
│   ├── types/                   # TypeScript type definitions
│   ├── utils/                   # Helper functions
│   └── db/                      # Data storage layer
│       └── storage.ts           # LocalStorage implementation
└── public/                      # Static assets
```

## 🎯 Usage

### Adding a Book
1. Navigate to **Reading List**
2. Click **Add Book**
3. Fill in the book details (title, author, subject, status, etc.)
4. Save to add it to your collection

### Creating a Note
1. Go to **Notes**
2. Click **New Note**
3. Enter title, select subject, and add tags
4. Write your note using Markdown
5. Use LaTeX syntax for math: `$E = mc^2$` or `$$\int_0^\infty e^{-x^2} dx$$`

### Tracking Progress
- Update reading progress in the Reading List
- View your progress on the Dashboard
- Check subject-specific pages for detailed insights

## 🔮 Future Enhancements

- [ ] User authentication (Google Auth / Email)
- [ ] Cloud storage integration (Supabase/Firebase)
- [ ] PDF upload and in-browser preview
- [ ] Flashcards with spaced repetition
- [ ] Graph view of linked notes (Obsidian-style)
- [ ] Export notes as PDF
- [ ] Quote extraction from PDFs
- [ ] Mobile-responsive design
- [ ] Dark/light mode toggle
- [ ] Book progress timeline visualization

## 📸 Screenshots

### Dashboard
![Dashboard](https://github.com/user-attachments/assets/1f7123d4-e870-42b7-b6c1-0da3b132fcb4)

### Reading List
![Reading List](https://github.com/user-attachments/assets/94f533f5-ad4e-402a-917b-f6a0165e449f)

### Study Notes with Math Support
![Study Notes](https://github.com/user-attachments/assets/27f28656-7b3f-4574-a278-f405a5cb4c95)

### Subject Page - Christianity
![Christianity](https://github.com/user-attachments/assets/a3d661d0-7eec-46b1-9fed-eee180707896)

## 📝 License

This project is open source and available under the MIT License.

## 👤 Author

**Yolanda Dube**
- GitHub: [@yolandadube](https://github.com/yolandadube)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- TailwindCSS for the utility-first CSS framework
- KaTeX for beautiful math rendering
- The open-source community
