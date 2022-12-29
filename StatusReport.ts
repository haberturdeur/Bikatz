import { Entry, Manager } from "./Manager"
import { Instance, System } from "./System"
import { Point, UUID } from "./trivial"

enum ReportType {
    BikePosition,
    RideStart,
    RideStop,
}

class StatusReport implements Entry {
    id: UUID | undefined = undefined
    instanceID: UUID | undefined | null = undefined
    timestamp: EpochTimeStamp
    type: ReportType
    data: string
    bikeID: UUID | null
    standID: UUID | null

    constructor(timestamp: EpochTimeStamp,
        type: ReportType,
        data: string,
        bikeID: UUID | null,
        standID: UUID | null) {
        this.timestamp = timestamp
        this.type = type
        this.data = data
        this.bikeID = bikeID
        this.standID = standID
    }
}

class ReportManager extends Manager<StatusReport> {

    constructor(instanceID: UUID) {
        super(instanceID)
    }

    processReport(parent: Instance, report: StatusReport) {
        this.create(report)

        const bike = report.bikeID ? parent.bikes.get(report.bikeID) : undefined
        const stand = report.standID ? parent.stands.get(report.standID) : undefined

        switch (report.type) {
            case ReportType.BikePosition:
                if (!bike)
                    return
                bike.position = Point.fromString(report.data)
                parent.bikes.update(bike.id!, bike)
                break

            case ReportType.RideStart:
                if (!bike)
                    return
                parent.rides.startRide(report.bikeID!, parent.areas.getCurrent(bike.position))
                break

            case ReportType.RideStop:
                if (!bike)
                    return
                parent.rides.stopRide(parent.rides.getOngoing(report.bikeID!).id!, parent.areas.getCurrent(bike.position))
                break

            default:
                break;
        }
    }

    createReport(timestamp: EpochTimeStamp,
        type: ReportType,
        data: string,
        bikeID: UUID | null,
        standID: UUID | null)
        : StatusReport {
        return this.create(new StatusReport(timestamp, type, data, bikeID, standID))
    }

    filterByBike(bike: UUID): Map<UUID, StatusReport> {
        return this.filter((v, k) => v.bikeID == bike)
    }
}

export { StatusReport, ReportManager } 