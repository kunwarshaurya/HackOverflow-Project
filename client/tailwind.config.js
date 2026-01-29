/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'marquee': 'marquee 30s linear infinite',
        'spin-slow': 'spin-slow 12s linear infinite',
        'ping-slow': 'ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'progress': 'progress 2s ease-out forwards',
        'slide-up': 'slide-up 0.8s ease-out forwards',
        'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
        'grow-bar': 'grow-bar 1s ease-out forwards',
        'scan': 'scan 2s linear infinite',
        'slide-paper': 'slide-paper 2s infinite ease-in-out',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        float: {
          '0%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
          '100%': { transform: 'translateY(0px) rotate(0deg)' },
        },
        'float-slow': {
          '0%': { transform: 'translateY(0px) rotate(12deg)' },
          '50%': { transform: 'translateY(-30px) rotate(8deg)' },
          '100%': { transform: 'translateY(0px) rotate(12deg)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'ping-slow': {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '100%': { transform: 'scale(1.5)', opacity: '0' },
        },
        progress: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(50px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(1.1)' },
        },
        'grow-bar': {
          '0%': { height: '0%' },
          '100%': { height: '100%' },
        },
        scan: {
          '0%': { top: '0', opacity: '1' },
          '50%': { opacity: '1' },
          '100%': { top: '100%', opacity: '0' },
        },
        equalizer: {
          '0%': { height: '30%' },
          '100%': { height: '100%' },
        },
        'slide-paper': {
          '0%': { transform: 'translateX(0) scale(1)', opacity: '1' },
          '100%': { transform: 'translateX(100px) scale(0.8)', opacity: '0' },
        },
      },
      perspective: {
        '1000': '1000px',
      },
      fontFamily: {
        'handwriting': ['Kalam', 'cursive'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}