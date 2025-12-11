import vine from '@vinejs/vine'

/**
 * Validator for creating a new user
 * Similar to registration but used by admin
 */
export const createUserValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .email()
      .unique(async (db, value) => {
        const user = await db.from('users').where('email', value).first()
        return !user
      }),

    password: vine.string().minLength(8),
    fullName: vine.string().minLength(2).maxLength(255),
    phone: vine.string().optional(),
    address: vine.string().optional(),
    dateOfBirth: vine.date().optional(),
    role: vine.enum(['admin', 'user']).optional(),
    isActive: vine.boolean().optional(),
  })
)

/**
 * Validator for updating existing user
 * All fields are optional, email must be unique if provided
 */
export const updateUserValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .email()
      .unique(async (db, value, field) => {
        // Check if email is unique excluding current user
        const user = await db
          .from('users')
          .where('email', value)
          .whereNot('id', field.data.params.id)
          .first()
        return !user
      })
      .optional(),

    password: vine.string().minLength(8).optional(),
    fullName: vine.string().minLength(2).maxLength(255).optional(),
    phone: vine.string().optional(),
    address: vine.string().optional(),
    dateOfBirth: vine.date().optional(),
    role: vine.enum(['admin', 'user']).optional(),
    isActive: vine.boolean().optional(),
  })
)
