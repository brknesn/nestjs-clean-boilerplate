import { Module } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import { Logger } from "nestjs-pino"
import { NestPinoModule } from "./pino.module"


export async function createLogger(): Promise<Logger> {
    @Module({
        imports: [NestPinoModule],
    })
    class TemporaryModule { }

    const temporaryApp = await NestFactory.createApplicationContext(TemporaryModule, {
        logger: false,
        abortOnError: false,
    })

    await temporaryApp.close()

    return temporaryApp.get(Logger)
}