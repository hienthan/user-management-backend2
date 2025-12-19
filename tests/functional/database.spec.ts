import { test } from '@japa/runner'
import db from '@adonisjs/lucid/services/db'

test.group('Database Connection', (group) => {
  group.teardown(async () => {
    await db.manager.closeAll()
  })

  test('should connect to database', async ({ assert }) => {
    const result = await db.rawQuery('SELECT 1 as value')
    assert.equal(result.rows[0].value, 1)
  })

  test('should verify PostgreSQL server', async ({ assert }) => {
    const result = await db.rawQuery('SELECT version()')
    assert.isTrue(result.rows[0].version.toLowerCase().includes('postgresql'))
  })

  test('should get current database name', async ({ assert }) => {
    const result = await db.rawQuery('SELECT current_database() as db_name')
    assert.isString(result.rows[0].db_name)
  })

  test('should handle concurrent queries', async ({ assert }) => {
    const results = await Promise.all([
      db.rawQuery('SELECT 1 as num'),
      db.rawQuery('SELECT 2 as num'),
      db.rawQuery('SELECT 3 as num'),
    ])
    assert.equal(results[0].rows[0].num, 1)
    assert.equal(results[1].rows[0].num, 2)
    assert.equal(results[2].rows[0].num, 3)
  })

  test('should handle transactions', async ({ assert }) => {
    const trx = await db.transaction()
    const result = await trx.rawQuery('SELECT 1 as value')
    await trx.rollback()
    assert.equal(result.rows[0].value, 1)
  })

  test('should reject invalid queries', async ({ assert }) => {
    try {
      await db.rawQuery('SELECT * FROM non_existent_table_xyz')
      assert.fail('Should have thrown')
    } catch (error) {
      assert.isDefined(error)
    }
  })
})
