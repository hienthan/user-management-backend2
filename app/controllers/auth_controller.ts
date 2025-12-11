import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import User from '#models/user'
import { loginValidator, registerValidator } from '../validator/auth.js'

export default class AuthController {
  /**
   * Handle user registration
   * POST /api/register
   */
  async register({ request, response }: HttpContext) {
    try {
      // Validate the incoming request data
      const payload = await request.validateUsing(registerValidator)

      // Convert dateOfBirth from Date to DateTime if present
      const userData = {
        ...payload,
        dateOfBirth: payload.dateOfBirth ? DateTime.fromJSDate(payload.dateOfBirth) : null,
      }

      // Create a new user with the validated data
      const user = await User.create(userData)

      // Return success response with user data (password excluded automatically)
      return response.created({
        message: 'User registered successfully',
        data: user,
      })
    } catch (error) {
      // Handle validation or database errors
      return response.badRequest({
        message: 'Registration failed',
        errors: error.messages || error.message,
      })
    }
  }

  /**
   * Handle user login
   * POST /api/login
   */
  async login({ request, response }: HttpContext) {
    try {
      // Validate login credentials
      const { email, password } = await request.validateUsing(loginValidator)

      // Verify user credentials using AdonisJS auth
      const user = await User.verifyCredentials(email, password)

      // Check if user account is active
      if (!user.isActive) {
        return response.forbidden({
          message: 'Your account has been deactivated',
        })
      }

      // Return success response with user info (no token)
      return response.ok({
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
          },
        },
      })
    } catch (error) {
      // Handle invalid credentials
      return response.unauthorized({
        message: 'Invalid email or password',
      })
    }
  }

  /**
   * Handle user logout
   * POST /api/logout
   */
  async logout({ response }: HttpContext) {
    try {
      // Simple logout response (no token management needed)
      return response.ok({
        message: 'Logged out successfully',
      })
    } catch (error) {
      return response.badRequest({
        message: 'Logout failed',
      })
    }
  }

  /**
   * Get current authenticated user information
   * GET /api/me
   */
  async me({ auth, response }: HttpContext) {
    try {
      // Get the authenticated user
      const user = auth.getUserOrFail()

      return response.ok({
        data: user,
      })
    } catch (error) {
      return response.unauthorized({
        message: 'Not authenticated',
      })
    }
  }
}
