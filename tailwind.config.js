/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: '#B39858',
            },
            width: {
                316: '316px',
                1200: '1200px',
                760: '760px',
                sidebar: '102px',
                primaryBtn: '110px',
            },
            height: {
                headerHeight: '76px',
                primaryBtn: '36px',
            },
            spacing: {
                headerHeight: '76px',
            },
            backgroundImage: {
                'bg-login': "url('./src/assets/bg-flip.png')",
                'bg-zebra': "url('./src/assets/bg-zebra.avif')",
            },
        },
    },
    plugins: [],
};
