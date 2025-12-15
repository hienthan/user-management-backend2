import router from '@adonisjs/core/services/router'

const AuthController = () => import('#controllers/auth_controller')
const UsersController = () => import('#controllers/users_controller')

router
  .group(() => {
    // Auth routes
    router.post('/register', [AuthController, 'register'])
    router.post('/login', [AuthController, 'login'])
    router.post('/logout', [AuthController, 'logout'])

    // User CRUD routes
    router.get('/users', [UsersController, 'index'])
    router.get('/users/:id', [UsersController, 'show'])
    router.post('/users', [UsersController, 'store'])
    router.put('/users/:id', [UsersController, 'update'])
    router.delete('/users/:id', [UsersController, 'destroy'])
  })
  .prefix('/api')
