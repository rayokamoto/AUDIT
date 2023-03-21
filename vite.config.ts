import { defineConfig } from "vite"

export default defineConfig({
    plugins: [],
    build: {
        outDir: "extension",
        emptyOutDir: true,
        rollupOptions: {
            input: {
                index: new URL('./src/main.ts', import.meta.url).pathname,
            },
			output : {
				entryFileNames: 'main.js'
			}
			
        }
    },
})
