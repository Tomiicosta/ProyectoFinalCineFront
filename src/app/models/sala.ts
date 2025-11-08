export interface Sala {
    id: number,
    name: string,
    screenType: string,
    atmos: Boolean, // maximo 200
    rowSeat: number,
    columnSeat: number,
    seatCapacity: number,
    enabled: boolean
}
