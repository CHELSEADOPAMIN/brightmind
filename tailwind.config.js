const { hairlineWidth } = require('nativewind/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './providers/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        ink: '#191412',
        paper: '#fff8f6',
        muted: '#6f625d',
        stroke: '#eadbd4',
        brand: '#df3f35',
        brandDeep: '#b92821',
        brandSoft: '#fde5df',
        surface: '#fffdfb',
        success: '#1d8f5a',
        warning: '#d97706',
      },
      fontFamily: {
        display: ['CormorantGaramond_600SemiBold'],
        body: ['Manrope_500Medium'],
        bodyBold: ['Manrope_700Bold'],
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
      boxShadow: {
        card: '0 18px 40px rgba(30, 18, 16, 0.08)',
      },
    },
  },
  plugins: [],
};
