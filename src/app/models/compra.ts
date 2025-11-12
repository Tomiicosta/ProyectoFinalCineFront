import { Butaca } from "./butaca";

export interface Compra {

    title: string; // Entrada de cine
    description: string; // Proyeccion de la pelicula Sombras en el paraiso en sala 3D

    userEmail: string; // email@gmail.com

    quantity: number; // 1
    unitPrice: number; // 3500.00
    
    functionId: number; // 2
    seats: String[]; // ["A1","C3"]

}