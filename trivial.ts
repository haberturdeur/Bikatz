type UUID = string;


class Point {
    latitude: string
    longitude: string

    constructor(latitude: string, longitude: string) {
        this.latitude = latitude
        this.longitude = longitude
    }

    static fromString(string: string): Point {
        return new Point("0", "0")
    }
}


export { Point, UUID }