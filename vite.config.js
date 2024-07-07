import { defineConfig } from 'vite'
import { resolve } from 'path';
import Handlebars from 'vite-plugin-handlebars';

export default defineConfig({
    plugins: [Handlebars()],
    build: {
        outDir: resolve(__dirname, 'dist'),
    },
    css: {
        preprocessorOptions: {
            less: {
                math: 'always',
                relativeUrls: true,
                javascriptEnabled: true
            },
        },
    },
})