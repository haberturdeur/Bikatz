import { Entry, Manager } from "./Manager";
import { Point, UUID } from "./trivial";

class Area extends Manager<Area> implements Entry {
    id: UUID | undefined = undefined
    instanceID: UUID | undefined | null
    boundary: Point[]

    constructor(instanceID : UUID, boundary: Point[]) {
        super(instanceID)
        this.boundary = boundary
    }
}

class AreaManager extends Manager<Area> {
    constructor(instanceID: UUID) {
        super(instanceID)
    }

    getCurrent(point: Point): Area { 
        return new Area(this.instanceID!, [point]) // I don't have the mental capacity to implement this right now....
    }

    createArea(boundary: Point[]): Area {
        return this.create(new Area(this.instanceID!, boundary))
    }
}

export { Area, AreaManager }