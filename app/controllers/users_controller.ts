import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import User from '#models/user'
import { createUserValidator, updateUserValidator } from '../validator/user.js'

export default class UsersController {
  /**
   * Get all users with pagination
   * GET /api/users
   */
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)
      const search = request.input('search', '')

      const query = User.query()

      if (search) {
        query.where((builder) => {
          builder.where('email', 'like', `%${search}%`).orWhere('full_name', 'like', `%${search}%`)
        })
      }

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
      const payload = await request.validateUsing(createUserValidator)

      const userData = {
        ...payload,
        dateOfBirth: payload.dateOfBirth ? DateTime.fromJSDate(payload.dateOfBirth) : null,
      }

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
   * PUT /api/users/:id
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id)
      const payload = await request.validateUsing(updateUserValidator)

      const updateData = {
        ...payload,
        dateOfBirth: payload.dateOfBirth ? DateTime.fromJSDate(payload.dateOfBirth) : undefined,
      }

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
  async destroy({ params, response }: HttpContext) {
    try {
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
