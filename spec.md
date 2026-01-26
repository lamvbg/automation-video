
# 📘 SPEC-KIT: React + Tailwind Portfolio Profile Generator

## 1. Overview

**Product name:** Developer Portfolio Profile
**Target user:** Backend / Golang Developer
**Goal:**
Generate a **modern, responsive, single-page portfolio website** using **React + TailwindCSS**, fully driven by structured JSON data.

Website must:

* Hiển thị đầy đủ **Personal, Projects, Tech Stack, Experience, Stats**
* Có **button Live Demo & GitHub clickable**
* Responsive (desktop / tablet / mobile)
* Tone màu **modern – dark/light neutral – tech feeling**
* Dễ mở rộng / thay data không cần sửa UI logic

---

## 2. Tech Stack Requirements

### Frontend

* React 18+
* TypeScript
* TailwindCSS
* Framer Motion (animation nhẹ)
* Lucide / HeroIcons (icon)
* Vite hoặc Next.js (không ràng buộc)

### Non-Functional

* Không hardcode text trong component
* UI render **100% từ JSON**
* Clean component separation
* Accessibility cơ bản (aria, focus)

---

## 3. Design System

### Color Tone (Modern Developer)

* Primary: Slate / Zinc / Neutral
* Accent: Emerald hoặc Indigo
* Background:

  * Dark mode default
  * Light mode optional

```txt
Background: #0f172a (slate-900)
Card: #020617 / #02061780
Text main: #e5e7eb
Text muted: #94a3b8
Accent: #10b981
```

### Typography

* Heading: Inter / Geist / Plus Jakarta Sans
* Code accent: JetBrains Mono (optional)

---

## 4. Data Contract (Input JSON)

> System **MUST accept exactly this structure** (no mutation)

```ts
interface PortfolioData {
  personal: Personal
  projects: Project[]
  testimonials: Testimonial[]
  techStack: TechCategory[]
  experience: Experience[]
  stats: Stats
}
```

⚠️ All UI rendering must be **data-driven**, no fallback fake content.

---

## 5. Page Structure & Sections

### 5.1 Hero / Intro Section

**Source:** `personal`

**UI requirements:**

* Avatar (rounded / glow)
* Name (large heading)
* Title (accent color)
* Tagline
* Bio (short paragraph)
* CTA buttons:

  * **View Projects** (scroll)
  * **GitHub Profile** (external link)

```txt
Button rules:
- GitHub button opens new tab
- Disable button if link empty
```

---

### 5.2 Stats Section

**Source:** `stats`

**UI:**

* Grid 4 columns (responsive)
* Animated counter on scroll
* Icon per stat

Example:

* 4+ Years Experience
* 6 Projects
* 10 Clients
* 800 Coffee ☕

---

### 5.3 Projects Section

**Source:** `projects`

**Layout:**

* Featured projects on top
* Card layout (image, title, tags, desc)

**Each Project Card must include:**

* Project image
* Title + year
* Description
* Tech tags (badge style)
* Action buttons:

  * 🔗 Live Demo (if `link !== ""`)
  * 💻 GitHub (always clickable)

```ts
if (!project.link) {
  hide Live button
}
```

Hover effects:

* Image zoom
* Card lift
* Button glow

---

### 5.4 Tech Stack Section

**Source:** `techStack`

**Layout:**

* Category cards
* Each card:

  * Category name
  * Description
  * Technology badges

Example:

* Backend
* Database
* DevOps
* Tools

---

### 5.5 Experience Timeline

**Source:** `experience`

**UI:**

* Vertical timeline
* Left: year range
* Right: company/project, role, description

Animation:

* Slide-in on scroll
* Stagger effect

---

### 5.6 Contact / Footer

**Source:** `personal`

**Must include:**

* Email (mailto)
* Location
* Social icons:

  * GitHub
  * LinkedIn
  * Twitter

Rules:

* Hide icon if link empty
* External links open new tab

---

## 6. Component Architecture

```txt
components/
 ├─ Hero.tsx
 ├─ Stats.tsx
 ├─ Projects/
 │   ├─ ProjectGrid.tsx
 │   └─ ProjectCard.tsx
 ├─ TechStack.tsx
 ├─ ExperienceTimeline.tsx
 ├─ Footer.tsx
 └─ common/
     ├─ Button.tsx
     ├─ Badge.tsx
     └─ Section.tsx
```

---

## 7. Interaction Rules

* Smooth scroll between sections
* Hover + focus states mandatory
* Buttons disabled state styled clearly
* All external links:

  ```html
  target="_blank" rel="noopener noreferrer"
  ```

---

## 8. Animation Guidelines

* Use **Framer Motion**
* No heavy animation
* Prefer:

  * fade-in
  * slide-up
  * scale on hover
* Must respect `prefers-reduced-motion`

---

## 9. Responsiveness

* Mobile first
* Breakpoints:

  * sm: 640px
  * md: 768px
  * lg: 1024px
* Cards stack vertically on mobile

---

## 10. Acceptance Criteria (Checklist)

✅ Render đúng 100% data JSON
✅ GitHub & Live buttons hoạt động
✅ Không crash nếu link rỗng
✅ Responsive mọi màn hình
✅ Clean code, không hardcode text
✅ Tone màu hiện đại, dev-style

---

## 11. Optional Enhancements

* Dark / Light toggle
* Download CV button
* SEO meta tags
* OG Image auto generate

---