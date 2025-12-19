/*
|--------------------------------------------------------------------------
| Test entrypoint
|--------------------------------------------------------------------------
|
| This file boots the AdonisJS application and configures the Japa
| tests runner.
|
*/

process.env.NODE_ENV = 'test'

import 'reflect-metadata'
import { Ignitor, prettyPrintError } from '@adonisjs/core'
import { configure, processCLIArgs, run } from '@japa/runner'

/**
 * URL to the application root. AdonisJS uses this URL to resolve
 * paths to the file system.
 */
const APP_ROOT = new URL('../', import.meta.url)

/**
 * The importer is used to import files in the context of the
 * application.
 */
const IMPORTER = (filePath: string) => {
  if (filePath.startsWith('./') || filePath.startsWith('../')) {
    return import(new URL(filePath, APP_ROOT).href)
  }
  return import(filePath)
}

/**
 * Japa importer that handles both string paths and URL objects
 */
const JAPA_IMPORTER = (filePath: string | URL) => {
  if (typeof filePath === 'string') {
    return import(filePath)
  }
  return import(filePath.href)
}

new Ignitor(APP_ROOT, { importer: IMPORTER })
  .tap((app) => {
    app.booting(async () => {
      await import('#start/env')
    })
    app.listen('SIGTERM', () => app.terminate())
    app.listenIf(app.managedByPm2, 'SIGINT', () => app.terminate())
  })
  .testRunner()
  .configure(async (app) => {
    const { plugins, reporters, runnerHooks } = await import('#tests/bootstrap')

    processCLIArgs(process.argv.splice(2))
    configure({
      ...app.rcFile.tests,
      ...runnerHooks,
      plugins,
      reporters,
      importer: JAPA_IMPORTER,
    })
  })
  .run(() => run())
  .catch((error) => {
    process.exitCode = 1
    prettyPrintError(error)
  })

