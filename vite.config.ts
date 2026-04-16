import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite' // v4 전용 플러그인

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})