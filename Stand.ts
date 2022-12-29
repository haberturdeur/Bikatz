import { Entry, Manager } from "./Manager"
import { Point, UUID } from "./trivial"

class Stand implements Entry {
    id : UUID | undefined = undefined
    instanceID: UUID | undefined | null = undefined

    position: Point

    constructor(position: Point) {
        this.position = position
    }
}

class StandManager extends Manager<Stand> {
    constructor(instanceID: UUID | null) {
        super(instanceID)
    }

    createStand(position: Point): Stand {
        return this.create(new Stand(position))
    }
}

export {Stand, StandManager}