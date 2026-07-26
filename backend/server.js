import 'dotenv/config'

import http from 'node:http'
import { createApp } from './src/app.js'
import { validateEnv } from './src/config/validateEnv.js'
import { connectDB, disconnectDB } from './src/config/db.js'
import { initFirebase } from './src/config/firebase.js'
import { logger } from './src/utils/logger.js'

const SHUTDOWN_TIMEOUT_MS = 10000

async function bootstrap() {
  // Fail fast if configuration is incomplete.
  validateEnv()

  // Initialize Firebase Admin up front so credential problems surface at boot.
  initFirebase()

  // Only start listening once Mongo is reachable.
  await connectDB(process.env.MONGO_URI)

  const app = createApp()
  const server = http.createServer(app)

  const PORT = process.env.PORT || 3000
  server.listen(PORT, () => {
    logger.info(`backend running on port ${PORT}`)
  })

  // Graceful shutdown: stop accepting connections, close the HTTP server, then
  // close Mongo. A hard timeout forces exit if something hangs.
  let shuttingDown = false
  const shutdown = async (signal) => {
    if (shuttingDown) return
    shuttingDown = true
    logger.info(`${signal} received, shutting down gracefully`)

    const forceTimer = setTimeout(() => {
      logger.error('Graceful shutdown timed out, forcing exit')
      process.exit(1)
    }, SHUTDOWN_TIMEOUT_MS)
    forceTimer.unref()

    server.close(async () => {
      try {
        await disconnectDB()
        clearTimeout(forceTimer)
        process.exit(0)
      } catch (err) {
        logger.error({ err }, 'Error during shutdown')
        process.exit(1)
      }
    })
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))
}

bootstrap().catch((err) => {
  logger.error({ err }, 'Failed to start server')
  process.exit(1)
})
