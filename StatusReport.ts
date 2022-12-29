import { BikeState } from "./Bike"
import { Entry, Manager } from "./Manager"
import { Instance } from "./System"
import { Point, UUID } from "./trivial"

enum ReportType {
    BikePosition,
    RideStart,
    RideStop,
    BikeEnteringStand,
    BikeLeavingStand,
    BikeCharged
    /*
    There would be more types of reports, but right now I am to lazy to think of them...
    */
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
                const data = JSON.parse(report.data)
                const pm = Array.from(parent.parent.paymentMethods.filter((v, k) => v.number === data.number && v.type == data.type).values())[0]
                parent.rides.startRide(report.bikeID!, pm.id!, parent.areas.getCurrent(bike.position), report.timestamp)
                break

            case ReportType.RideStop:
                if (!bike)
                    return
                parent.rides.stopRide(parent.rides.getOngoing(report.bikeID!).id!, parent.areas.getCurrent(bike.position), report.timestamp)
                break

            case ReportType.BikeEnteringStand:
                if (!bike || !stand)
                    return
                stand.enterBike(report.bikeID!, Number(report.data))
                parent.stands.update(stand.id!, stand)
                bike.state = BikeState.Charging
                parent.bikes.update(bike.id!, bike)
                break

            case ReportType.BikeLeavingStand:
                if (!bike || !stand)
                    return
                stand.leaveBike(Number(report.data))
                parent.stands.update(stand.id!, stand)
                break

            case ReportType.BikeCharged:
                if (!bike || !stand)
                    return
                bike.state = BikeState.Available
                parent.bikes.update(bike.id!, bike)
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