//type EstadoButaca = 'disponible' | 'ocupada' | 'seleccionada';

//export interface Butaca {
//    id: string; 
//    fila: string; 
//    columna: number; 
//    estado: EstadoButaca;
//    hover: boolean;
//}

export interface Butaca {
    id: number; 
    rowNumber: number; 
    columnNumber: number; 
    occupied: boolean;
}