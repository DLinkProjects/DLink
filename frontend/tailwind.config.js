/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundColor: {
        'custom-hover': 'var(--semi-color-tertiary-light-default)',
        'close-hover': 'var(--semi-color-danger)',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
