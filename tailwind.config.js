module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: '#ffffff',
        foreground: '#0f172a',
        card: '#f8fafc',
        'card-foreground': '#0f172a',
        popover: '#ffffff',
        'popover-foreground': '#0f172a',
        primary: {
          DEFAULT: '#16a34a',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#f1f5f9',
          foreground: '#0f172a',
        },
        muted: {
          DEFAULT: '#f1f5f9',
          foreground: '#64748b',
        },
        accent: {
          DEFAULT: '#e2e8f0',
          foreground: '#0f172a',
        },
        destructive: {
          DEFAULT: '#dc2626',
          foreground: '#ffffff',
        },
        success: {
          DEFAULT: '#16a34a',
          foreground: '#ffffff',
        },
        warning: {
          DEFAULT: '#f59e0b',
          foreground: '#78350f',
        },
        border: '#e2e8f0',
        input: '#e2e8f0',
        ring: '#16a34a',
        'chart-1': '#22c55e',
        'chart-2': '#10b981',
        'chart-3': '#86efac',
        'chart-4': '#f59e0b',
        'chart-5': '#0ea5e9',
        sidebar: {
          DEFAULT: '#f8fafc',
          foreground: '#0f172a',
          primary: '#16a34a',
          'primary-foreground': '#ffffff',
          accent: '#f1f5f9',
          'accent-foreground': '#0f172a',
          border: '#e2e8f0',
          ring: '#16a34a',
        },
      },
      borderRadius: {
        lg: '0.75rem',
        md: 'calc(var(--radius) * 0.8)',
        sm: 'calc(var(--radius) * 0.6)',
        xl: 'calc(var(--radius) * 1.4)',
        '2xl': 'calc(var(--radius) * 1.8)',
        '3xl': 'calc(var(--radius) * 2.2)',
        '4xl': 'calc(var(--radius) * 2.6)',
      },
    },
  },
  plugins: [],
}
