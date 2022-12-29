import { Entry, Manager } from "./Manager";
import { Point, UUID } from "./trivial";

enum LockState {
    Locked,
    Unlocked
}

enum BikeState {
    Available,
    Rented,
    Charging,
    AwaitingMaintenance,
}

class Bike implements Entry {
    id: UUID | undefined = undefined
    instanceID: UUID | undefined | null = undefined

    lockState: LockState
    position: Point
    batteryLevel: number
    state: BikeState

    constructor(lockState: LockState, position: Point, batteryLevel: number, state: BikeState) {
        this.lockState = lockState
        this.position = position
        this.batteryLevel = batteryLevel
        this.state = state
    }
}

class BikeManager extends Manager<Bike> {
    constructor(instanceID: UUID) {
        super(instanceID)
    }

    createBike(lockState: LockState,
        position: Point,
        batteryLevel: number,
        state: BikeState) : Bike {
        return this.create(new Bike(lockState, position, batteryLevel, state))
    }
}

export {LockState, BikeState, Bike, BikeManager}