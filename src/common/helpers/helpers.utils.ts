import { UTCDate } from "@date-fns/utc"

export const HelperService = {
    getTimeInUtc(date: Date | string): Date {
        const thatDate = date instanceof Date ? date : new Date(date)
        const currentUtcTime = new UTCDate(thatDate)

        return new Date(currentUtcTime.toString())
    },
}
