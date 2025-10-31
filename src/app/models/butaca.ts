export interface Butaca {
    id: string; // Identificador único (Ej: "A1", "B5")
    fila: string; // Ejemplo: 'A', 'B', 'C'
    columna: number; // Ejemplo: 1, 2, 3
    estado: 'disponible' | 'seleccionada' | 'ocupada';
    hover: boolean; // Para manejar el efecto hover
}