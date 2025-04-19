// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          100: "#175AFF"
        }
      }
    },
  },
  plugins: [],
};
