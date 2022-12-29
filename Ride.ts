import { Area } from "./Area"
import { Entry, Manager } from "./Manager"
import { UUID } from "./trivial"

class Ride implements Entry {
    id: UUID | undefined = undefined
    instanceID: string | null | undefined = undefined
    bikeID: UUID
    paymentMethodID: UUID
    distance: number
    cost: number
    isPaid: boolean
    ongoing: boolean
    startedIn: Area
    start: EpochTimeStamp
    finishedIn: Area | undefined
    stop: EpochTimeStamp | undefined

    constructor(bikeID: UUID,
        paymentMethodID: UUID,
        distance: number,
        cost: number,
        isPaid: boolean,
        ongoing: boolean,
        startedIn: Area,
        start: EpochTimeStamp,
        finishedIn: Area | undefined,
        stop: EpochTimeStamp | undefined) {
        this.bikeID = bikeID
        this.paymentMethodID = paymentMethodID
        this.distance = distance
        this.cost = cost
        this.isPaid = isPaid
        this.ongoing = ongoing
        this.startedIn = startedIn
        this.finishedIn = finishedIn
        this.start = start
        this.stop = stop
    }
}

class RideManager extends Manager<Ride> {
    constructor(instanceID: string) {
        super(instanceID)
    }

    startRide(bikeID: UUID, paymentMethodID: UUID, startingArea: Area, start: EpochTimeStamp): Ride {
        return this.createRide(bikeID,
            paymentMethodID,
            0,
            0,
            false,
            true,
            startingArea,
            start,
            undefined,
            undefined)
    }

    stopRide(id: UUID, stopArea: Area, stop: EpochTimeStamp): Ride | undefined {
        const ride = this.get(id)
        if (!ride || !ride.ongoing)
            return undefined
        ride.distance = 0 // FIXME: calculate distance
        ride.cost = 0 // FIXME: calculate cost
        ride.ongoing = false
        ride.finishedIn = stopArea
        ride.stop = stop

        return this.update(id, ride)
    }

    createRide(bikeID: UUID,
        paymentMethodID: UUID,
        distance: number,
        cost: number,
        isPaid: boolean,
        ongoing: boolean,
        startedIn: Area,
        start: EpochTimeStamp,
        finishedIn: Area | undefined,
        stop: EpochTimeStamp | undefined)
        : Ride {
        return this.create(new Ride(bikeID, paymentMethodID, distance, cost, isPaid, ongoing, startedIn, start, finishedIn, stop))
    }

    filterByBike(bikeID: UUID): Map<UUID, Ride> {
        return this.filter((v, k) => v.bikeID === bikeID)
    }

    getOngoing(bikeID: UUID): Ride {
        return Array.from(this.filter((v, k) => (v.bikeID === bikeID && v.ongoing)).values())[0]
    }
}

export { Ride, RideManager }