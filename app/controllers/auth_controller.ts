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
      const payload = await request.validateUsing(registerValidator)

      const userData = {
        ...payload,
        dateOfBirth: payload.dateOfBirth ? DateTime.fromJSDate(payload.dateOfBirth) : null,
      }

      const user = await User.create(userData)

      return response.created({
        message: 'User registered successfully',
        data: user,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Registration failed',
        errors: error.messages || error.message,
      })
    }
  }

  /**
   * Handle user login (plain text password comparison)
   * POST /api/login
   */
  async login({ request, response }: HttpContext) {
    try {
      const { email, password } = await request.validateUsing(loginValidator)

      // Find user by email and compare plain text password
      const user = await User.query().where('email', email).first()

      if (!user || user.password !== password) {
        return response.unauthorized({
          message: 'Invalid email or password',
        })
      }

      if (!user.isActive) {
        return response.forbidden({
          message: 'Your account has been deactivated',
        })
      }

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
    return response.ok({
      message: 'Logged out successfully',
    })
  }
}
