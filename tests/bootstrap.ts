/**
 * Test bootstrap file - Configures the Japa test runner for AdonisJS
 */

import { assert } from '@japa/assert'
import { apiClient } from '@japa/api-client'
import app from '@adonisjs/core/services/app'
import { pluginAdonisJS } from '@japa/plugin-adonisjs'

/**
 * Configure Japa plugins in the tests runner
 */
export const plugins = [assert(), apiClient(), pluginAdonisJS(app)]

/**
 * Configure test reporters
 */
export const reporters = {
  activated: ['spec'] as const,
}

/**
 * Configure test runner hooks
 * Note: Migrations are not run automatically to avoid conflicts with existing tables.
 * Run `node ace migration:run` manually before testing if needed.
 */
export const runnerHooks = {
  setup: [] as Array<() => Promise<void>>,
  teardown: [] as Array<() => Promise<void>>,
}

