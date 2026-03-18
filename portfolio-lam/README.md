# Portfolio Generator

A modern, responsive portfolio website built with React, TypeScript, and Tailwind CSS. Generate your portfolio from a simple JSON configuration file.

## Features

- Modern dark theme design with smooth animations
- Fully responsive layout
- JSON-based profile configuration
- Sections: Hero, Projects, Testimonials, Tech Stack, About, Contact
- Powered by Framer Motion for animations
- Built with Vite for fast development

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Configuration

Edit the `src/data/profile.json` file to customize your portfolio:

```json
{
  "personal": {
    "name": "Your Name",
    "title": "Your Title",
    "tagline": "Your tagline",
    "bio": "About yourself",
    "email": "your@email.com",
    "location": "Your Location",
    "social": {
      "github": "https://github.com/yourusername",
      "linkedin": "https://linkedin.com/in/yourusername"
    }
  },
  "projects": [...],
  "testimonials": [...],
  "techStack": [...],
  "experience": [...],
  "stats": {...}
}
```

## Tech Stack

- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- Lucide Icons
- Vite

## License

MIT
