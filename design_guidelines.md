# LATAM Reportero - Brand Design Guidelines

## Color Palette

### Primary Brand Colors
- **Light Purple:** `#8c52ff` - Main accent color
- **Dark Purple:** `#6111ff` - Secondary accent, gradients

### Secondary Colors
- **Offset Beige:** `#E7DAC4` - Backgrounds, tags
- **Brand White:** `#f9f6f6` - Page backgrounds
- **Off-Black:** `#1a1919` - Text color

### Usage
- Primary buttons: Purple gradient (`from-[#8c52ff] to-[#6111ff]`)
- Secondary elements: Beige (`#E7DAC4`)
- Hover states: Add purple glow (`shadow-[#8c52ff]/30`)
- Links: Purple on hover (`hover:text-[#8c52ff]`)

## Typography

### Font Families
1. **Headlines (Raleway)** - Bold headlines and navigation
   - Use: `font-family: 'Raleway', sans-serif`
   - Weights: 600, 700, 800

2. **Subheadings (Marcellus)** - Elegant subheadings
   - Use: `font-family: 'Marcellus', Georgia, serif`
   - Weight: 400 (regular)

3. **Body Text (Source Serif 4)** - Article content
   - Use: `font-family: 'Source Serif 4', 'Times New Roman', serif`
   - Italic for captions

### Typography Scale
- Hero Headlines: `text-4xl md:text-6xl lg:text-7xl font-extrabold`
- Section Headlines: `text-3xl md:text-4xl font-bold`
- Card Headlines: `text-xl md:text-2xl font-semibold`
- Body: `text-lg` with `line-height: 1.8`
- Captions: `text-sm italic`

## Component Styles

### Buttons
```jsx
// Primary Button
className="bg-gradient-to-r from-[#8c52ff] to-[#6111ff] text-white hover:shadow-lg hover:shadow-[#8c52ff]/30 transition-all"

// Secondary Button
className="bg-[#E7DAC4] text-[#1a1919] hover:bg-[#E7DAC4]/80"

// Outline Button
className="border-2 border-[#8c52ff] text-[#8c52ff] hover:bg-[#8c52ff] hover:text-white"
```

### Category Tags
```jsx
// Purple tag (primary category)
className="bg-gradient-to-r from-[#8c52ff] to-[#6111ff] text-white"

// Beige tag (region/secondary)
className="bg-[#E7DAC4] text-[#1a1919]"
```

### Navigation Links
```jsx
className="nav-link link-underline"
// Hover adds purple underline animation
```

### Cards
```jsx
className="editorial-card" // Adds subtle purple hover glow
```

## Layout Patterns

### Hero Grid
- Featured article: 8 columns with dark overlay gradient
- Side articles: 4 columns with dividers

### Article Grid
- 3-column grid for article cards
- Consistent spacing with `gap-8`

### Section Backgrounds
- Main content: Brand white (`#f9f6f6`)
- Feature sections: Purple gradient
- Stats bar: Beige tint (`bg-[#E7DAC4]/20`)
- Newsletter: Purple gradient

## CSS Classes Reference

### Typography Classes
- `.headline-hero` - Large impact headlines
- `.headline-section` - Section titles
- `.headline-card` - Card titles
- `.subheading-large` - Marcellus subheadings
- `.body-article` - Article body text
- `.caption-meta` - Uppercase meta text
- `.caption-italic` - Italic captions
- `.gradient-text` - Purple gradient text effect

### Component Classes
- `.editorial-card` - Cards with hover effect
- `.editorial-button` - Primary buttons
- `.editorial-button-secondary` - Secondary buttons
- `.editorial-button-outline` - Outline buttons
- `.category-tag` - Purple category badges
- `.category-tag-beige` - Beige region badges
- `.nav-link` - Navigation styling
- `.link-underline` - Animated underline links

### Layout Classes
- `.editorial-grid` - 12-column grid
- `.editorial-grid-hero` - Hero area (8 cols)
- `.editorial-grid-side` - Sidebar (4 cols)
- `.editorial-divider` - Gradient divider
- `.editorial-divider-thick` - Bold purple divider

### Special Effects
- `.gradient-text` - Purple gradient text
- `.hover-lift` - Lift on hover
- `.image-zoom` - Image zoom on hover
- `.accent-bar` - Purple accent bar

## Responsive Breakpoints
- Mobile: default
- Tablet: `md:` (768px+)
- Desktop: `lg:` (1024px+)

## Accessibility
- High contrast maintained for readability
- Focus states use purple outline
- All interactive elements have hover states
- Reduced motion support included

---
Last Updated: December 2025
