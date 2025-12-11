import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

// Import controllers
const AuthController = () => import('#controllers/auth_controller')
const UsersController = () => import('#controllers/users_controller')

/**
 * API Routes
 * All routes are prefixed with /api
 */
router
  .group(() => {
    /**
     * Public Authentication Routes
     * No authentication required
     */
    router.group(() => {
      router.post('/register', [AuthController, 'register'])
      router.post('/login', [AuthController, 'login'])
    })

    /**
     * Public User Routes
     * No authentication required for listing users
     */
    router.get('/users', [UsersController, 'index']) // List all users

    /**
     * Protected Routes
     * Require authentication token
     */
    router
      .group(() => {
        // Auth routes
        router.post('/logout', [AuthController, 'logout'])
        router.get('/me', [AuthController, 'me'])

        // User management routes (CRUD operations)
        router.get('/users/:id', [UsersController, 'show']) // Get single user
        router.post('/users', [UsersController, 'store']) // Create user
        router.put('/users/:id', [UsersController, 'update']) // Update user
        router.delete('/users/:id', [UsersController, 'destroy']) // Delete user
      })
      .use(middleware.auth()) // Apply auth middleware to all routes in this group
  })
  .prefix('/api') // All routes start with /api
