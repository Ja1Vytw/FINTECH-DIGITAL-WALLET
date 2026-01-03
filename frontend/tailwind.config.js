/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8b5cf6',
          dark: '#7c3aed',
          light: '#a78bfa',
        },
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
        text: {
          DEFAULT: '#1f2937',
          light: '#6b7280',
          lighter: '#9ca3af',
        },
        bg: {
          DEFAULT: '#ffffff',
          secondary: '#f9fafb',
          tertiary: '#f3f4f6',
          dark: '#0f172a',
        },
        border: {
          DEFAULT: '#e5e7eb',
          light: '#f3f4f6',
          dark: '#334155',
        },
        foreground: {
          DEFAULT: '#1f2937',
          dark: '#f9fafb',
        },
        'muted-foreground': {
          DEFAULT: '#6b7280',
          dark: '#9ca3af',
        },
        accent: {
          DEFAULT: '#f3f4f6',
          dark: '#1e293b',
        },
        card: {
          DEFAULT: '#ffffff',
          dark: '#1e293b',
        },
        destructive: '#ef4444',
        'primary-foreground': '#ffffff',
        'accent-foreground': {
          DEFAULT: '#1f2937',
          dark: '#f9fafb',
        },
        'chart-3': '#8b5cf6',
        background: {
          DEFAULT: '#ffffff',
          dark: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        'error-gradient': 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
      },
      boxShadow: {
        'form': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'button': '0 4px 16px rgba(139, 92, 246, 0.3)',
        'button-hover': '0 6px 20px rgba(139, 92, 246, 0.4)',
        'error': '0 2px 8px rgba(239, 68, 68, 0.1)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}
