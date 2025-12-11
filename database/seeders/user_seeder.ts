import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    // Create admin user
    await User.updateOrCreate(
      { email: 'admin@example.com' },
      {
        email: 'admin@example.com',
        password: 'password123', // Will be hashed automatically
        fullName: 'Admin User',
        phone: '0123456789',
        address: '123 Admin Street',
        role: 'admin',
        isActive: true,
      }
    )

    // Create sample regular users
    await User.updateOrCreateMany('email', [
      {
        email: 'john.doe@example.com',
        password: 'password123',
        fullName: 'John Doe',
        phone: '0987654321',
        address: '456 User Avenue',
        role: 'user',
        isActive: true,
      },
      {
        email: 'jane.smith@example.com',
        password: 'password123',
        fullName: 'Jane Smith',
        phone: '0912345678',
        address: '789 Demo Road',
        role: 'user',
        isActive: true,
      },
    ])

    console.log('Users seeded successfully!')
  }
}
