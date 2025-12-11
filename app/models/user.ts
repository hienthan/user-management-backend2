import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'

// Compose the model with authentication functionality
const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  // Primary key
  @column({ isPrimary: true })
  declare id: number

  // Authentication fields
  @column()
  declare email: string

  @column({ serializeAs: null }) // Don't include password in JSON responses
  declare password: string

  // Profile information
  @column()
  declare fullName: string

  @column()
  declare phone: string | null

  @column()
  declare address: string | null

  @column.date()
  declare dateOfBirth: DateTime | null

  // Role and status
  @column()
  declare role: 'admin' | 'user'

  @column()
  declare isActive: boolean

  // Timestamps
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
