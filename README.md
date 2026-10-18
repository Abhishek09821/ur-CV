# ur-CV

A lightweight, client-side resume builder and universal PDF editor designed for official Amity University placement drives and Jake's ATS software engineer standards.

ur-CV runs entirely in the browser with zero server data retention. It allows students and engineers to either generate verified placement resumes from scratch or upload and edit existing PDF resumes directly on desktop and mobile without breaking original layouts, fonts, or headers.

---

## Screenshots

### 1. Landing Gateway
![Landing Page](docs/screenshots/landing.png)

### 2. Live Resume Builder (Amity & Jake's ATS Formats)
![Resume Builder](docs/screenshots/builder.png)

### 3. Template Switcher
![Template Picker](docs/screenshots/format_picker.png)

### 4. Universal PDF Quick Editor
![Universal PDF Quick Editor](docs/screenshots/upload_editor.png)

---

## Core Features

- **Official Amity University Placement Format**: Includes approved university shield logo, candidate passport photo box, charcoal section headers, academic table, and mandatory self-declaration.
- **Jake's ATS Resume Standard**: Overleaf / LaTeX software engineering layout optimized for ATS scanning with clean 1px section rules, right-aligned dates, and bullet hierarchies.
- **Universal PDF In-Place Editor**: Upload any existing PDF resume (Canva, Word, LaTeX, Amity). Selectively edit Career Objective, Technical Skills, and Work Experience while preserving original vector headers, contact details, fonts, and bounding boxes.
- **Real-Time Space Gauges**: Dynamic line-capacity meters calculate section boundaries and alert you before text exceeds page limits or causes overflow.
- **Client-Side Vector PDF Export**: Generates 100% searchable, crisp vector PDFs directly in the browser using jsPDF and PDF.js without third-party server processing.
- **Mobile Responsive**: Fully optimized for mobile screens with touch-friendly step navigation, photo compressor, and zoomable sheet previews.

---

## Tech Stack

- **Core**: Vanilla JavaScript (ES Modules), HTML5
- **Styling**: Vanilla CSS (Neo-Brutalist Design System)
- **PDF Engine**: `pdfjs-dist` (Text extraction & layout detection), `jspdf` (Vector PDF compilation), `html2pdf.js`
- **Build Tool**: Vite 6

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

```bash
git clone https://github.com/Abhishek09821/ur-CV.git
cd ur-CV
npm install
```

### Development Server

Start the local Vite development server:

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Production Build

Create an optimized production bundle in the `dist` directory:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## Project Structure

```text
ur-CV/
├── docs/
│   └── screenshots/         # Documentation screenshots
├── public/                  # Static assets and PDF sample resumes
├── src/
│   ├── assets/              # University logos and graphics
│   ├── components/          # Modals, upload dropzone, toast, preview overlays
│   ├── styles/              # Neo-brutalist CSS design system
│   ├── utils/               # PDF document engine, vector PDF generator
│   ├── views/               # Landing gateway, split builder, upload editor
│   ├── main.js              # Application entry point & router
│   └── store.js             # LocalStorage state management
├── index.html
├── package.json
└── vite.config.js
```

---

## Privacy & Security

All document parsing, image compression, draft caching, and PDF generation happen 100% client-side inside the user's browser. No resumes, contact information, or personal data are ever transmitted to or stored on external servers.

---

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---

## Developer

Developed by **Abhishek Tiwari**  
- LinkedIn: [https://www.linkedin.com/in/abhishek-tiwari-3a3594300](https://www.linkedin.com/in/abhishek-tiwari-3a3594300)  
- GitHub: [https://github.com/Abhishek09821](https://github.com/Abhishek09821)
