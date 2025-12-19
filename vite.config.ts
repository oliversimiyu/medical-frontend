import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use polling to avoid hitting OS file watcher limits (ENOSPC)
  server: {
    watch: {
      usePolling: true,
      interval: 1000,
    },
  },
})
