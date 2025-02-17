/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js,ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Roboto", "Bijoy", "Arial", "sans-serif"],
            },
            colors: {
                primary: "green",
            },
        },
    },
    plugins: [],
};
