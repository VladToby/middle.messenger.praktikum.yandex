import { defineConfig } from 'vite'
import { resolve } from 'path';
import Handlebars from 'vite-plugin-handlebars';

export default defineConfig({
    plugins: [Handlebars({})],
    root: resolve(__dirname, 'src'),
    build: {
        outDir: resolve(__dirname, 'dist'),
        rollupOptions: {
            input: {
                index: resolve(__dirname, 'src/index.html'),
            },
        },
    },
    css: {
        preprocessorOptions: {
            less: {
                math: 'always',
                relativeUrls: true,
                javascriptEnabled: true
            },
        },
    }
})
