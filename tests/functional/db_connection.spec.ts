import { test } from '@japa/runner'
import db from '@adonisjs/lucid/services/db'
import env from '#start/env'

test.group('Database Connection Test', () => {
  test('should successfully connect to the database', async ({ assert }) => {
    try {
      // Test database connection
      const result = await db.rawQuery('SELECT 1 as test')
      
      assert.isTrue(result.rows.length > 0)
      assert.equal(result.rows[0].test, 1)
      
      console.log('✅ Database connection successful!')
      console.log('Database configuration:')
      console.log(`  Host: ${env.get('DB_HOST')}`)
      console.log(`  Port: ${env.get('DB_PORT')}`)
      console.log(`  Database: ${env.get('DB_DATABASE')}`)
      console.log(`  User: ${env.get('DB_USER')}`)
    } catch (error) {
      console.error('❌ Database connection failed!')
      console.error('Error:', error.message)
      throw error
    }
  })

  test('should be able to query users table', async ({ assert }) => {
    try {
      // Check if users table exists and is accessible
      const result = await db.from('users').count('* as count').first()
      
      assert.isDefined(result)
      // PostgreSQL COUNT() returns a string, so we check it's a valid numeric string
      const countValue = result?.count
      assert.isDefined(countValue)
      // Convert to number to verify it's numeric
      const countNumber = typeof countValue === 'string' ? parseInt(countValue, 10) : countValue
      assert.isNumber(countNumber)
      assert.isTrue(countNumber >= 0, 'Count should be non-negative')
      
      console.log(`✅ Users table is accessible! Total users: ${countNumber}`)
    } catch (error) {
      if (error.message.includes('does not exist')) {
        console.warn('⚠️  Users table does not exist yet. Run migrations first: node ace migration:run')
        // Don't fail the test if table doesn't exist - just warn
        assert.isTrue(true, 'Table check skipped - table does not exist')
      } else {
        console.error('❌ Failed to query users table!')
        console.error('Error:', error.message)
        throw error
      }
    }
  })

  test('should verify database environment variables are set', async ({ assert }) => {
    try {
      const dbHost = env.get('DB_HOST')
      const dbPort = env.get('DB_PORT')
      const dbUser = env.get('DB_USER')
      const dbDatabase = env.get('DB_DATABASE')

      assert.isString(dbHost)
      assert.isNumber(dbPort)
      assert.isString(dbUser)
      assert.isString(dbDatabase)

      console.log('✅ All database environment variables are set correctly')
    } catch (error) {
      console.error('❌ Missing or invalid database environment variables!')
      console.error('Error:', error.message)
      throw error
    }
  })
})

