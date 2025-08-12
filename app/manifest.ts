import type { MetadataRoute } from 'next'
 
export const dynamic = 'force-static'; // 👈 This tells Next.js to pre-render at build time

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Expense Tracker',
    short_name: 'ExpTracker',
    description: 'A Progressive Web App for tracking expenses',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon.webp',
        sizes: '192x192',
        type: 'image/webp',
      },
      {
        src: '/icon-512x512.webp',
        sizes: '512x512',
        type: 'image/webp',
      },
    ],
  }
}