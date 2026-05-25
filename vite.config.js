import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages private sites block crossorigin (cookieless) asset requests.
// This plugin removes the crossorigin attribute so the browser sends cookies.
function removeCrossOrigin() {
  return {
    name: 'remove-crossorigin',
    transformIndexHtml(html) {
      return html.replace(/ crossorigin/g, '')
    },
  }
}

export default defineConfig({
  plugins: [react(), removeCrossOrigin()],
  base: '/Jbb-ai-test-v1/',
})
