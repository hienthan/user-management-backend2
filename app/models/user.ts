import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare email: string

  @column()
  declare password: string

  @column({ columnName: 'full_name' })
  declare fullName: string

  @column()
  declare phone: string | null

  @column()
  declare address: string | null

  @column.date({ columnName: 'date_of_birth' })
  declare dateOfBirth: DateTime | null

  @column()
  declare role: 'admin' | 'user'

  @column({ columnName: 'is_active' })
  declare isActive: boolean

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime | null
}
