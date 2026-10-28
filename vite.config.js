import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve('index.html'),
        crowdofone: resolve('projects/crowdofone.html'),
        counterfeittrace: resolve('projects/counterfeittrace.html'),
        proxyproof: resolve('projects/proxyproof.html'),
        chipin: resolve('projects/chip-in.html'),
        notFound: resolve('404.html'),
      },
    },
  },
})
