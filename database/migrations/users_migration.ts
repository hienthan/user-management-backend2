import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      // Primary key - auto increment ID
      table.increments('id').primary()

      // User authentication fields
      table.string('email', 254).notNullable().unique()
      table.string('password', 180).notNullable()

      // User profile information
      table.string('full_name', 255).notNullable()
      table.string('phone', 20).nullable()
      table.text('address').nullable()
      table.date('date_of_birth').nullable()

      // User role and status
      table.enum('role', ['admin', 'user']).defaultTo('user')
      table.boolean('is_active').defaultTo(true)

      // Timestamps - created_at and updated_at
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    // Drop the users table when rolling back
    this.schema.dropTable(this.tableName)
  }
}
