import { Entry, Manager } from "./Manager"
import { Point, UUID } from "./trivial"

class Stand implements Entry {
    id : UUID | undefined = undefined
    instanceID: UUID | undefined | null = undefined

    position: Point
    capacity: number
    bikes: Array<UUID | null>

    constructor(position: Point, capacity: number) {
        this.position = position
        this.capacity = capacity
        this.bikes = new Array<UUID | null>(capacity)
        this.bikes.fill(null)
    }

    enterBike(bikeID: UUID, position : number) {
        this.bikes[position] = bikeID
    }

    leaveBike(position: number) {
        this.bikes[position] = null
    }
}

class StandManager extends Manager<Stand> {
    constructor(instanceID: UUID | null) {
        super(instanceID)
    }

    createStand(position: Point, capacity : number) : Stand {
        return this.create(new Stand(position, capacity))
    }
}

export {Stand, StandManager}