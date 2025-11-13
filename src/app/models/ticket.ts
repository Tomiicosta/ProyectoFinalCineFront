import { Time } from "@angular/common";


export interface Ticket {
    id: number;
    movieTitle: string;
        cinemaId: number;
    funcionId: number;
        purchaseDate: Date;
        purchaseTime: Time;
        unitPrice: number;
        totalAmount: number;
        quantity: number;
        seats: number[];
}