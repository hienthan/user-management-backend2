import vine from '@vinejs/vine'

/**
 * Validator for user registration
 * Ensures all required fields are present and valid
 */
export const registerValidator = vine.compile(
  vine.object({
    // Email must be valid and unique in database
    email: vine
      .string()
      .email()
      .unique(async (db, value) => {
        const user = await db.from('users').where('email', value).first()
        return !user // Returns true if email is unique
      }),

    // Password must be at least 8 characters
    password: vine.string().minLength(8),

    // Full name is required
    fullName: vine.string().minLength(2).maxLength(255),

    // Phone is optional
    phone: vine.string().optional(),

    // Address is optional
    address: vine.string().optional(),

    // Date of birth is optional
    dateOfBirth: vine.date().optional(),

    // Role defaults to 'user' if not provided
    role: vine.enum(['admin', 'user']).optional(),
  })
)

/**
 * Validator for user login
 * Only requires email and password
 */
export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string(),
  })
)
