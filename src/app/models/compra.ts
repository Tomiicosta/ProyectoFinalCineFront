import { Butaca } from "./butaca";

export interface Compra {

    id: number;
    movieTitle: string;
    cinemaId: number; // Sala A
    purchaseDate: string;
    purchaseTime: string;

    unitPrice: number; // para el back

    cantButacas: number; // para el back

    movieId: number; // para el back
    fecha: string;
    hora: string;

    butacas: Butaca[];

}