
export interface Funcion {
    id: number;
    date: string;              // YYYY-MM-DD (LocalDate)
    time: string;               // HH:mm:ss (LocalTime)
    runTime: number;
    availableCapacity: number;
    movieName: string;
    movieId: number;
    cinemaName: string;
    cinemaId: number;
    unitPrice: number; // precio x entrada - funcion
}
