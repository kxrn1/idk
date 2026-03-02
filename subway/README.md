# Subway Portfolio

A professionally designed, minimalist portfolio website built with Next.js, React, and Tailwind CSS. Features a refined black and white aesthetic with Apple-inspired smooth animations.

## Design Philosophy

- **Minimalist Aesthetic**: Pure black and white color scheme
- **No Gradients**: Clean, flat design language
- **Floating Containers**: Elevated cards with subtle shadows
- **Rounded Corners**: Consistent 8px-24px radius system
- **Custom Components**: Every UI element is custom-built
- **Smooth Animations**: Apple-like cubic-bezier transitions
- **Reduced Motion Support**: Respects user preferences
- **Custom Scrollbar**: Visible and styled across all browsers

## Features

- 🎨 Pure black & white design system
- 🌓 Dark/Light mode with smooth transitions
- 📱 Fully responsive across all devices
- ⚡ Custom smooth animations (cubic-bezier)
- ♿ Respects `prefers-reduced-motion`
- 📜 Custom styled scrollbar (cross-browser)
- 🔍 Intersection Observer for scroll animations
- 📊 Scroll progress indicator
- 🎯 Active section highlighting

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Fonts**: Inter, SF Mono
- **Deployment**: Vercel

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## Deploy on Vercel

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Auto-detects Next.js configuration
4. Deploy

## Design System

### Colors
- **Foreground**: `#000000` / `#FFFFFF` (dark)
- **Background**: `#FFFFFF` / `#000000` (dark)
- **Surface**: `#F5F5F7` / `#1C1C1E` (dark)
- **Border**: `#D2D2D7` / `#38383A` (dark)

### Typography
- **Primary**: Inter (300-700)
- **Monospace**: SF Mono

### Spacing
- **Radius**: 8px, 12px, 16px, 24px
- **Shadows**: 4 levels (sm, md, lg, xl)

### Animations
- **Smooth**: `cubic-bezier(0.25, 0.1, 0.25, 1)`
- **Bounce**: `cubic-bezier(0.34, 1.56, 0.64, 1)`
- **Duration**: 300ms - 800ms

## Customization

Edit data in `app/page.tsx`:
- `experience` array
- `projects` array
- `techStack` array
- `blogPosts` array
- Contact information

## Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Focus visible states
- Reduced motion support
- High contrast ratios
- Keyboard navigation

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License
