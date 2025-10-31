import { Butaca } from "./butaca";

export interface Compra {
    movieId: number; // para el back
    fecha: string;
    hora: string;

    butacas: Butaca[];
    cantButacas: number; // para el back

    precioUnidad: number; // para el back
}