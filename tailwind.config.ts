import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0f1419',
          800: '#1a1f36',
          700: '#2d3250',
          600: '#3d4466',
          500: '#4f567d',
        },
        cream: {
          100: '#fafaf8',
          200: '#f5f5f0',
          300: '#e8e8e3',
          400: '#d4d4cf',
        },
        accent: {
          DEFAULT: '#8B2332',
          hover: '#7A1E2C',
          light: '#A33344',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
