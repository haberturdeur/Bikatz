import { Area } from "./Area"
import { Entry, Manager } from "./Manager"
import { UUID } from "./trivial"

class Ride implements Entry {
    id: UUID | undefined = undefined
    instanceID: string | null | undefined = undefined
    bikeID: UUID
    distance: number
    cost: number
    isPaid: boolean
    ongoing: boolean
    startedIn: Area
    finishedIn: Area | undefined

    constructor(bikeID: UUID, distance: number, cost: number, isPaid: boolean, ongoing: boolean, startedIn: Area, finishedIn: Area | undefined) {
        this.bikeID = bikeID
        this.distance = distance
        this.cost = cost
        this.isPaid = isPaid
        this.ongoing = ongoing
        this.startedIn = startedIn
        this.finishedIn = finishedIn
    }
}

class RideManager extends Manager<Ride> {
    constructor(instanceID: string) {
        super(instanceID)
    }

    startRide(bikeID: UUID, startingArea: Area): Ride {
        return this.createRide(bikeID, 0, 0, false, true, startingArea, undefined)
    }

    stopRide(id: UUID, stopArea: Area): Ride | undefined {
        const ride = this.get(id)
        if (!ride || !ride.ongoing)
            return undefined
        ride.distance = 0 // FIXME: calculate distance
        ride.cost = 0 // FIXME: calculate cost
        ride.ongoing = false
        ride.finishedIn = stopArea

        return this.update(id, ride)
    }

    createRide(bikeID: UUID,
        distance: number,
        cost: number,
        isPaid: boolean,
        ongoing: boolean,
        startedIn: Area,
        finishedIn: Area | undefined)
        : Ride {
        return this.create(new Ride(bikeID, distance, cost, isPaid, ongoing, startedIn, finishedIn))
    }

    filterByBike(bikeID: UUID) : Map<UUID, Ride> {
        return this.filter((v,k) => v.bikeID === bikeID)
    }

    getOngoing(bikeID: UUID) : Ride {
        return Array.from(this.filter((v,k) => (v.bikeID === bikeID && v.ongoing)).values())[0]
    }
}

export { Ride, RideManager }