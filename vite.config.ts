// import { defineConfig } from "vite"

// export default defineConfig({
//     plugins: [],

// })

// /// 

// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  if (mode === 'chrome') {
    return {
      build: {
        outDir: "extension/chrome",
        emptyOutDir: true,
        rollupOptions: {
            input: {
                index: new URL('./src/chrome/main.ts', import.meta.url).pathname,
            },
			output : {
				entryFileNames: 'main.js'
			}
        }
    },
    }
  }

  if (mode === 'firefox') {
    return {
      build: {
        outDir: "extension/firefox",
        emptyOutDir: true,
        rollupOptions: {
            input: {
                index: new URL('./src/firefox/main.ts', import.meta.url).pathname,
            },
			output : {
				entryFileNames: 'main.js'
			}
			
        }
    },
    }
  }
  return {}
});
