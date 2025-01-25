import type { INestApplication, ValidationPipeOptions } from "@nestjs/common"

import { Logger } from "@nestjs/common"

const logger = new Logger("App:Utils")

export const AppUtils = {
    validationPipeOptions(): ValidationPipeOptions {
        return {
            whitelist: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
            forbidUnknownValues: false,
            validateCustomDecorators: true,
            enableDebugMessages: true,
        }
    },

    async gracefulShutdown(app: INestApplication, code: string) {
        setTimeout(() => process.exit(1), 5000)
        logger.verbose(`Signal received with code ${code} ⚡.`)
        logger.log("❗Closing http server with grace.")

        try {
            await app.close()
            logger.log("✅ Http server closed.")
            process.exit(0)
        }
        catch (error: any) {
            logger.error(`❌ Http server closed with error: ${error}`)
            process.exit(1)
        }
    },

    killAppWithGrace(app: INestApplication) {
        process.on("SIGINT", async () => {
            await AppUtils.gracefulShutdown(app, "SIGINT")
        })

        process.on("SIGTERM", async () => {
            await AppUtils.gracefulShutdown(app, "SIGTERM")
        })
    },
}