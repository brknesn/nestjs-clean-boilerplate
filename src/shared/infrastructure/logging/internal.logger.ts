import { ConsoleLogger } from "@nestjs/common"

export class InternalDisabledLogger extends ConsoleLogger {
    static contextsToIgnore = [
        "InstanceLoader",
        "RoutesResolver",
        "RouterExplorer",
        "NestFactory",
    ]

    log(message: any, context?: string): void {
        if ((context != null) && !InternalDisabledLogger.contextsToIgnore.includes(context)) {
            super.log(message, context)
        }
    }
}