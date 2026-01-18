/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        sans: ['Poppins', 'Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        // Vibrant natural palette - Emerald based
        emerald: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#145231',
        },
      },
      boxShadow: {
        'sm': '0 2px 8px rgba(0,0,0,0.08)',
        'md': '0 4px 12px rgba(0,0,0,0.1)',
        'lg': '0 8px 24px rgba(0,0,0,0.12)',
      },
      backgroundImage: {
        // Professional purple/white with soft indigo/violet glows
        'app-gradient': 'radial-gradient(1100px 520px at -10% -20%, rgba(168,85,247,0.22), transparent 60%), radial-gradient(900px 420px at 120% 0%, rgba(99,102,241,0.20), transparent 60%), radial-gradient(800px 380px at 50% 120%, rgba(236,72,153,0.16), transparent 60%), linear-gradient(to bottom right, #faf7ff, #f8fafc)',
        // Button gradient sweeping purple family
        'btn-gradient': 'linear-gradient(135deg, #a855f7 0%, #7c3aed 40%, #6366f1 100%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '50%': { transform: 'translateY(-12px) translateX(6px)' },
        },
        drift: {
          '0%, 100%': { transform: 'translateY(0) translateX(0) scale(1)' },
          '50%': { transform: 'translateY(10px) translateX(-8px) scale(1.05)' },
        },
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'drift-slower': 'drift 16s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
