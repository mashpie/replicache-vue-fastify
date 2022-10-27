import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8080, // <-- port used by vite's devserver
    strictPort: true,
    hmr: {
      clientPort: 443 // <-- port used by browser to connect to nginx
    }
  }
})
