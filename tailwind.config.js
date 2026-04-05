/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'neon-cyan': '#00f5ff',
        'neon-magenta': '#ff00ff',
        'neon-yellow': '#ffff00',
        background: '#0a0a0f',
        card: '#0f0f1a',
        border: '#1a1a2e',
        foreground: '#e0e0ff',
        muted: '#1a1a2e',
        'muted-foreground': '#6b7280',
        primary: '#00f5ff',
        'primary-foreground': '#000',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'monospace'],
        body: ['var(--font-body)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
