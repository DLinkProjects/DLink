/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundColor: {
        'custom-hover': 'var(--semi-color-tertiary-light-default)',
        'close-hover': 'var(--semi-color-danger)',
        'tertiary-hover': 'var(--semi-color-fill-1)',
        'tertiary-active': 'var(--semi-color-fill-2)',
      },
      borderWidth: {
        hover: '0', // 添加一个用于悬停时的边框宽度类
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
