export interface Ticket {
    id: number;
    movieTitle: string;
    cinemaId: number;
    funcionId: number;
    purchaseDate: string;
    purchaseTime: string;
    unitPrice: number;
    totalAmount: number;
    quantity: number;
    seats: string[];
}
