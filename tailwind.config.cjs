// LazyBooks | Tailwind 3 mapped to theme tokens only. No raw colours here: every value is a --lb-* variable.
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/**/*.{html,tsx,ts}'],
  theme: {
    extend: {
      colors: {
        'lb-bg': 'var(--lb-bg)',
        'lb-surface': 'var(--lb-surface)',
        'lb-surface-raised': 'var(--lb-surface-raised)',
        'lb-sunken': 'var(--lb-surface-sunken)',
        'lb-border': 'var(--lb-border)',
        'lb-border-strong': 'var(--lb-border-strong)',
        'lb-text': 'var(--lb-text)',
        'lb-muted': 'var(--lb-text-muted)',
        'lb-faint': 'var(--lb-text-faint)',
        'lb-accent': 'var(--lb-accent)',
        'lb-accent-soft': 'var(--lb-accent-soft)',
        'lb-accent-contrast': 'var(--lb-accent-contrast)',
        'lb-success': 'var(--lb-success)',
        'lb-warning': 'var(--lb-warning)',
        'lb-danger': 'var(--lb-danger)',
        'lb-info': 'var(--lb-info)',
      },
      borderRadius: {
        'lb-sm': 'var(--lb-radius-sm)',
        'lb-md': 'var(--lb-radius-md)',
        'lb-lg': 'var(--lb-radius-lg)',
        'lb-xl': 'var(--lb-radius-xl)',
      },
    },
  },
};
