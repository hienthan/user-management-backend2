import { defineConfig } from '@adonisjs/cors'

/**
 * CORS Configuration
 * Allows frontend application to make requests to the API
 */
export default defineConfig({
  // Enable CORS for all routes
  enabled: true,

  // Allow requests from these origins
  // In production, replace with your actual frontend domain
  // NOTE: Port 13000 is used when frontend runs in Docker (mapped from container port 3000)
  origin: [
    'http://localhost:3000',   // Local development (frontend not in Docker)
    'http://localhost:3001',    // Alternative local port
    'http://localhost:3002',    // Alternative local port
    'http://localhost:13000',  // Docker: frontend container port 3000 → host port 13000
  ],

  // Allowed HTTP methods
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH'],

  // Allowed headers in requests
  headers: true,

  // Allow credentials (cookies, authorization headers)
  credentials: true,

  // Expose these headers to the browser
  exposeHeaders: [],

  // Cache preflight request results for 2 hours
  maxAge: 7200,
})
