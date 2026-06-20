/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-deep':    'var(--bg-deep)',
        'bg-card':    'var(--bg-card)',
        'bg-raised':  'var(--bg-raised)',
        'bg-hover':   'var(--bg-hover)',
        'gold':       'var(--gold)',
        'gold-light': 'var(--gold-light)',
        'gold-dim':   'var(--gold-dim)',
        'text-pri':   'var(--text-primary)',
        'text-sec':   'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'border-col': 'var(--border)',
        'border-mid': 'var(--border-mid)',
        'teal':       'var(--accent-teal)',
        'amber-col':  'var(--accent-amber)',
      },
      fontFamily: {
        display: ['Open Sans', 'Arial', 'Helvetica', 'sans-serif'],
        body:    ['Open Sans', 'Arial', 'Helvetica', 'sans-serif'],
        sans:    ['Open Sans', 'Arial', 'Helvetica', 'sans-serif'],
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        ripple: {
          '0%':   { opacity: '0.6', transform: 'scale(1)' },
          '100%': { opacity: '0',   transform: 'scale(1.5)' },
        },
        breathe: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(201,168,76,0)' },
          '50%':      { boxShadow: '0 0 0 4px rgba(201,168,76,0.15)' },
        },
        blink: {
          '0%, 80%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '40%':           { transform: 'translateY(-5px)', opacity: '1' },
        },
      },
      animation: {
        'fade-up':  'fadeUp 0.3s ease both',
        'ripple':   'ripple 2s ease-out infinite',
        'breathe':  'breathe 2s ease-in-out infinite',
        'blink':    'blink 1.3s infinite',
        'blink-2':  'blink 1.3s 0.18s infinite',
        'blink-3':  'blink 1.3s 0.36s infinite',
      },
    },
  },
  plugins: [],
}
