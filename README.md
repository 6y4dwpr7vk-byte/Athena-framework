# Athena — Boundary-Respecting Systems

A framework for institutional analysis and judgment boundary mapping. Athena provides analytical tools for evaluating boundary-respecting and boundary-violating behaviors in institutional contexts.

## Overview

The Athena framework consists of:

- **Judgment Boundary Framework (JBF)**: Core analytical methodology for mapping institutional boundaries
- **Diagnostic Classification System**: Structured taxonomy for categorizing boundary behaviors
- **Interactive Diagnostic Tool**: Web-based application for real-time boundary analysis
- **Worked Examples**: Applied case studies across diverse institutional contexts

## Architecture

This repository contains two main components:

### 1. Frontend Application (`app/`)

Static HTML/CSS/JavaScript application providing:
- Comprehensive documentation of the framework
- Academic resources and examples
- Interactive diagnostic tool interface

### 2. Backend Worker (`worker/`)

Cloudflare Worker providing:
- API endpoint for diagnostic analysis
- Boundary behavior classification
- CORS-enabled for local development

## Project Structure

```
athena-system/
├── app/
│   ├── assets/
│   │   ├── styles.css          # Global styles with CSS variables
│   │   ├── images/             # Visual assets
│   │   └── papers/             # Academic papers (JBF.pdf, institutions.pdf)
│   ├── index.html              # Home page
│   ├── about/index.html        # About the field
│   ├── jbf/index.html          # Judgment Boundary Framework
│   ├── sociology/index.html    # Sociology note
│   ├── diagnostic-class/index.html  # Diagnostic classification
│   ├── demo/index.html         # Interactive diagnostic tool
│   ├── examples/index.html     # Worked examples
│   ├── info/index.html         # Citations and licensing
│   ├── robots.txt              # Search engine directives
│   └── sitemap.xml             # Site structure for SEO
└── worker/
    ├── src/index.ts            # Worker logic with CORS
    └── wrangler.toml           # Worker configuration
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A local development server for the frontend (e.g., `http-server`, `live-server`, or any static file server)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/6y4dwpr7vk-byte/Athena-framework.git
   cd Athena-framework
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

   This installs `concurrently` for running both services simultaneously.

## Local Development

### Quick Start (Recommended)

Start both the frontend and backend with a single command:

```bash
npm start
```

This launches:
- **Frontend** on `http://localhost:3000`
- **Worker** on `http://localhost:8787`

Access the application at `http://localhost:3000` and test the interactive tool at `http://localhost:3000/demo/`

### Manual Setup (Alternative)

If you prefer to run services individually:

#### Running the Backend Worker

The Cloudflare Worker must be running to enable the interactive diagnostic tool.

1. **Navigate to the worker directory:**

   ```bash
   cd worker
   ```

2. **Start the worker in development mode:**

   ```bash
   npx wrangler dev
   ```

   This starts the worker on `http://localhost:8787` with CORS enabled for local development.

3. **Verify the worker is running:**

   ```bash
   curl -X POST http://localhost:8787 \
     -F "institutionName=Test Institution" \
     -F "institutionType=academic" \
     -F "statedBoundaries=Test boundaries" \
     -F "observedBehaviors=Test behaviors"
   ```

   You should receive a JSON response with diagnostic analysis.

#### Running the Frontend Application

The frontend can be served using any static file server.

1. **Navigate to the app directory:**

   ```bash
   cd app
   ```

2. **Option A: Using Python's built-in server:**

   ```bash
   # Python 3
   python3 -m http.server 3000

   # Python 2
   python -m SimpleHTTPServer 3000
   ```

3. **Option B: Using Node.js `http-server`:**

   ```bash
   # Install http-server globally (one time)
   npm install -g http-server

   # Start the server
   http-server -p 3000
   ```

4. **Option C: Using `live-server` (with auto-reload):**

   ```bash
   # Install live-server globally (one time)
   npm install -g live-server

   # Start the server
   live-server --port=3000
   ```

5. **Access the application:**

   Open your browser and navigate to `http://localhost:3000`

### Individual Service Commands

You can also run services separately using these npm scripts:

```bash
npm run worker    # Start only the Cloudflare Worker (port 8787)
npm run app       # Start only the frontend (port 3000)
npm run dev       # Alias for npm start
```

## Features

### Framework Documentation

- **Home (`/`)**: Overview and introduction
- **About (`/about/`)**: Field background and theoretical foundations
- **JBF (`/jbf/`)**: Complete Judgment Boundary Framework methodology
- **Sociology (`/sociology/`)**: Institutional applications and sociological perspectives
- **Diagnostic Classification (`/diagnostic-class/`)**: Categorization system for boundary behaviors

### Interactive Tools

- **Demo (`/demo/`)**: Real-time diagnostic tool with backend integration
- **Examples (`/examples/`)**: Worked case studies across institutional contexts

### Resources

- **Info (`/info/`)**: Citations, licensing, and academic papers
- Academic papers in `/assets/papers/`:
  - `JBF.pdf` - Theoretical foundations
  - `institutions.pdf` - Institutional applications

## Design Specifications

### Color Palette

```css
--bg: #fafafa        /* Background */
--accent: #1f2937    /* Primary accent */
--border: #d9d9d9    /* Borders and dividers */
```

### Layout

- **Container Width**: 980px (centered)
- **Navigation**: Global horizontal navigation on all pages
- **Typography**: System fonts with academic styling
- **Tone**: Institutional, academic, declarative

## API Reference

### POST /

Diagnostic analysis endpoint.

**Request Format:** `multipart/form-data`

**Parameters:**
- `institutionName` (required): Name of the institution or system
- `institutionType` (required): Type of institution (academic, healthcare, regulatory, platform, government, corporate, other)
- `statedBoundaries` (required): Formally documented boundaries and scope
- `observedBehaviors` (required): Actual practices and decision patterns
- `specificConcerns` (optional): Specific questions or concerns

**Response Format:** `application/json`

```json
{
  "diagnostic": "<html>Formatted diagnostic analysis...</html>"
}
```

**CORS:** Enabled for all origins in development (`Access-Control-Allow-Origin: *`)

## Deployment

### Frontend Deployment

The frontend is a static site and can be deployed to:
- Cloudflare Pages
- Netlify
- Vercel
- GitHub Pages
- Any static hosting service

### Worker Deployment

Deploy the Cloudflare Worker to production:

```bash
cd worker
npx wrangler deploy
```

**Important:** Update CORS settings in `worker/src/index.ts` for production:

```typescript
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://your-domain.com',
  // ... other headers
};
```

## Contributing

Contributions are welcome in several forms:

- **Case Studies**: Application of the framework to new institutional contexts
- **Methodological Refinements**: Framework extensions or classification improvements
- **Educational Materials**: Teaching resources maintaining academic rigor

Please maintain the institutional, academic tone in all contributions.

## Citations & Licensing

### Framework

The Athena framework is released under Creative Commons Attribution 4.0 International License (CC BY 4.0).

### Papers

Academic papers are subject to their respective publisher terms. See `/info/` for detailed citations.

### Software

Interactive tools and worker code are released under the MIT License.

## Academic Foundation

The Athena framework synthesizes research from:
- Institutional theory
- Organizational boundaries
- Judgment analysis
- Professional sociology
- Boundary theory

All theoretical foundations are documented in the accompanying papers available at `/assets/papers/`.

## Contact

- **Academic inquiries**: [contact information]
- **Technical questions**: [contact information]
- **Institutional consultation**: [contact information]

## Version

**Current Version**: 1.0
**Last Updated**: January 22, 2026

---

**Athena — Boundary-Respecting Systems**
Institutional analysis framework for judgment boundary mapping
