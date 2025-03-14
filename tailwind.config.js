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
                860: '860px',
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
                'bg-login':
                    "url('https://firebasestorage.googleapis.com/v0/b/chat-app-1000a.appspot.com/o/lydinc%2Fbg-flip.png?alt=media&token=07e0b420-920a-48a6-8250-f089f6d12915')",
                'bg-zebra':
                    "url('https://firebasestorage.googleapis.com/v0/b/chat-app-1000a.appspot.com/o/lydinc%2Fbg-zebra.avif?alt=media&token=ccbacae5-f93c-4d18-9e23-7ff5c1af12df')",
            },
        },
    },
    plugins: [],
};
