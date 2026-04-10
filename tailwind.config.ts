import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          // Primary — matches docs.dr.doctor header
          primary:       '#46BE69',   // bright green (header background)
          primaryDark:   '#107433',   // dark green (buttons, links, hover)
          primaryLight:  '#84D49B',   // light green (table headers, subtle accents)
          // Background
          cream:         '#ffffff',   // white page background (matches docs)
          // Secondary palette (kept for any future use)
          secondary:     '#3B1645',
          secondaryLight:'#52205F',
          magenta:       '#860C6E',
          magentaDark:   '#67095B',
          accent:        '#107433',
          accentDark:    '#0d5e2a',
        },
      },
      fontFamily: {
        // PolySans Standard — headings (place woff2 in /public/fonts/)
        heading: ['PolySans Standard', 'Roboto', 'system-ui', 'sans-serif'],
        // RM Neue — body text (place woff2 in /public/fonts/)
        body:    ['RM Neue', 'Roboto', 'system-ui', 'sans-serif'],
        // Kalam — decorative / special text
        kalam:   ['Kalam', 'cursive'],
        // Monospace — code / HL7 fields
        mono:    ['JetBrains Mono', 'Fira Code', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config
