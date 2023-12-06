import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    host: true,
    port: 8000,
    watch: {
      usePolling: true
    }
  },
  build: {
    sourcemap: false
  }
})
