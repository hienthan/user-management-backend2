import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import User from '#models/user'
import { createUserValidator, updateUserValidator } from '../validator/user.js'

export default class UsersController {
  /**
   * Get all users with pagination
   * GET /api/users
   * Query params: page, limit, search
   */
  async index({ request, response }: HttpContext) {
    try {
      // Get pagination parameters from query string
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)
      const search = request.input('search', '')

      // Build query with optional search functionality
      const query = User.query()

      // If search term exists, filter by email or full name
      if (search) {
        query.where((builder) => {
          builder.where('email', 'like', `%${search}%`).orWhere('full_name', 'like', `%${search}%`)
        })
      }

      // Execute query with pagination
      const users = await query.paginate(page, limit)

      return response.ok({
        message: 'Users retrieved successfully',
        data: users,
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to retrieve users',
        error: error.message,
      })
    }
  }

  /**
   * Get a single user by ID
   * GET /api/users/:id
   */
  async show({ params, response }: HttpContext) {
    try {
      // Find user by ID, throw 404 if not found
      const user = await User.findOrFail(params.id)

      return response.ok({
        message: 'User retrieved successfully',
        data: user,
      })
    } catch (error) {
      return response.notFound({
        message: 'User not found',
      })
    }
  }

  /**
   * Create a new user
   * POST /api/users
   */
  async store({ request, response }: HttpContext) {
    try {
      // Validate incoming request data
      const payload = await request.validateUsing(createUserValidator)

      // Convert dateOfBirth from Date to DateTime if present
      const userData = {
        ...payload,
        dateOfBirth: payload.dateOfBirth ? DateTime.fromJSDate(payload.dateOfBirth) : null,
      }

      // Create new user in database
      const user = await User.create(userData)

      return response.created({
        message: 'User created successfully',
        data: user,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Failed to create user',
        errors: error.messages || error.message,
      })
    }
  }

  /**
   * Update an existing user
   * PUT/PATCH /api/users/:id
   */
  async update({ params, request, response }: HttpContext) {
    try {
      // Find the user to update
      const user = await User.findOrFail(params.id)

      // Validate update data
      const payload = await request.validateUsing(updateUserValidator)

      // Convert dateOfBirth from Date to DateTime if present
      const updateData = {
        ...payload,
        dateOfBirth: payload.dateOfBirth ? DateTime.fromJSDate(payload.dateOfBirth) : undefined,
      }

      // Update user with new data
      user.merge(updateData)
      await user.save()

      return response.ok({
        message: 'User updated successfully',
        data: user,
      })
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({
          message: 'User not found',
        })
      }

      return response.badRequest({
        message: 'Failed to update user',
        errors: error.messages || error.message,
      })
    }
  }

  /**
   * Delete a user
   * DELETE /api/users/:id
   */
  async destroy({ params, response, auth }: HttpContext) {
    try {
      // Prevent users from deleting themselves
      const currentUser = await auth.getUserOrFail()
      const currentUserId = (currentUser as unknown as User).id
      if (currentUserId === Number(params.id)) {
        return response.forbidden({
          message: 'You cannot delete your own account',
        })
      }

      // Find and delete the user
      const user = await User.findOrFail(params.id)
      await user.delete()

      return response.ok({
        message: 'User deleted successfully',
      })
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({
          message: 'User not found',
        })
      }

      return response.internalServerError({
        message: 'Failed to delete user',
        error: error.message,
      })
    }
  }
}
