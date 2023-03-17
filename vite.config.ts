import { defineConfig } from "vite"

export default defineConfig({
    plugins: [],
    build: {
        outDir: "extension",
        emptyOutDir: true,
        rollupOptions: {
            input: {
                index: new URL('./popup.html', import.meta.url).pathname,
                background: new URL('./background.html', import.meta.url).pathname,
            }
        }
    },
})
