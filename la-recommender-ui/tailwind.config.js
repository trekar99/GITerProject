/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                'got': ['"Cinzel"', 'serif'], // Fuente Game of Thrones
            },
            colors: {
                'lannister-red': '#8a1c1c',
                'lannister-gold': '#d4af37',
                'stark-grey': '#cdcfd1',
                'night-watch': '#1a1a1a',
            }
        },
    },
    plugins: [],
}