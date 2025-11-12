import { Component, computed, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from '../../services/ticket/ticket-service';
import { NgClass } from '@angular/common';
import { Pelicula } from '../../models/pelicula';
import { Butaca } from '../../models/butaca';
import { Location } from '@angular/common';
import { Funcion } from '../../models/funcion';
import Movie from '../../models/movie';
import { FunctionService } from '../../services/function/function-service';
import { CinemaService } from '../../services/cinema/cinema-service';
import { Sala } from '../../models/sala';

@Component({
  selector: 'app-ticket-step3',
  standalone: true, // Si usas standalone, si no, elimina o dejalo
  imports: [NgClass],
  templateUrl: './ticket-step3.html',
  styleUrl: './ticket-step3.css',
})
export class TicketStep3 implements OnInit {

  // Mapa de Butacas (Inicializado con la nueva estructura)
  // Las butacas que eran 'ocupada' ahora tienen occupied: true
  mapaButacas: WritableSignal<Butaca[][]> = signal([]);

  // Asientos Seleccionados (Ahora solo guarda el objeto Butaca de las seleccionadas)
  butacasSeleccionadas: WritableSignal<Butaca[]> = signal([]);

  // Signal para mostrar mensajes de error en la UI
  errorMessage: WritableSignal<string | null> = signal(null);

  // Propiedades computadas para la UI
  totalButacasSeleccionadas = computed(() => this.butacasSeleccionadas().length);
  // Lista de IDs de butacas seleccionadas para mostrar en la UI
  listaButacasSeleccionadas = computed(() =>
    this.butacasSeleccionadas().map(b => `${String.fromCharCode(64 + b.rowNumber)}${b.columnNumber}`).join(', ')
  );

  // Variables no-signals
  peliculaSeleccionada: Movie | undefined;
  funcionSeleccionada: Funcion | undefined;

  constructor(
    private location: Location,
    private router: Router,
    private ticketService: TicketService,
    private functionService: FunctionService,
    public cinemaService: CinemaService
  ) { }

  ngOnInit(): void {
    // La lógica de inicialización y carga del servicio se mantiene
    this.peliculaSeleccionada = this.ticketService.getPeliculaSeleccionada();
    this.funcionSeleccionada = this.ticketService.getFuncion();

    if (!this.peliculaSeleccionada || !this.funcionSeleccionada) return;

    // Recibe la Sala por Funcion
    this.cinemaService.getSala(this.funcionSeleccionada.cinemaId).subscribe({
      next: (data) => { this.cinemaService.selectedSala = data },
      error: (e) => console.error("Error CinemaService getSala = ", e)
    });

    if (!this.cinemaService.selectedSala) return;

    this.cargarMapaButacas(this.funcionSeleccionada.id, this.cinemaService.selectedSala.id);
  }

  cargarMapaButacas(functionId: number, cinemaId: number) {

    // Recibe las Butacas por Funcion
    this.functionService.getSeatsByFunction(functionId)
      .subscribe({
        next: (butacas) => {
          // Agrupar las butacas por fila
          const matrizButacas: Butaca[][] = Array.from({ length: this.cinemaService.selectedSala?.rowSeat || 0 }, () =>
            Array(this.cinemaService.selectedSala?.columnSeat || 0).fill(null)
          );

          for (const b of butacas) {
            const rowIndex = b.rowNumber - 1; // restamos 1 si las filas empiezan desde 1
            const colIndex = b.columnNumber - 1;
            matrizButacas[rowIndex][colIndex] = b;
          }

          this.mapaButacas.set(matrizButacas);
        },
        error: (err) => console.error('Error al cargar butacas:', err)
      });
  }

  // Método para manejar el click en una butaca disponible
  seleccionarButaca(butaca: Butaca): void {
    if (butaca.occupied) {
      // Si la butaca esta ocupada
      this.errorMessage.set("ERROR: La butaca ya está ocupada.");
      return;
    }

    this.errorMessage.set(null); // Limpiar error si la seleccion es valida

    // Se usa el id para saber si ya esta seleccionada
    const isSelected = this.butacasSeleccionadas().some(b => b.id === butaca.id);

    this.butacasSeleccionadas.update(currentSelections => {
      if (isSelected) {
        // Si esta seleccionada, la quitamos (deseleccionar)
        return currentSelections.filter(b => b.id !== butaca.id);
      } else {
        // Si no esta seleccionada, la agregamos (seleccionar)
        return [...currentSelections, butaca];
      }
    });
  }

  // Metodo para verificar si una butaca esta seleccionada (para NgClass)
  isButacaSeleccionada(butaca: Butaca): boolean {
    return this.butacasSeleccionadas().some(b => b.id === butaca.id);
  }

  // Limpia todas las butacas seleccionadas
  limpiarButacasSeleccionadas(): void {
    // Simplemente vaciamos el Signal de butacas seleccionadas
    this.butacasSeleccionadas.set([]);
    this.errorMessage.set(null);
  }

  confirmarPaso3(): void {

    if (!this.peliculaSeleccionada || !this.funcionSeleccionada) return;

    // Lógica de confirmación:
    if (this.totalButacasSeleccionadas() === 0) {
      this.errorMessage.set("ERROR: Seleccione al menos una butaca para continuar.");
      return;
    }

    // El resto de la lógica de guardado y navegación se mantiene igual

    this.ticketService.setCompra({
      title: "Entrada de cine", // Entrada de cine
      description: "Proyeccion de la pelicula " + this.peliculaSeleccionada?.title + " en " + this.funcionSeleccionada?.cinemaName, // Proyeccion de la pelicula Sombras en el paraiso en sala 3D

      userEmail: "", // email@gmail.com

      quantity: this.butacasSeleccionadas.length, // 1
      unitPrice: 3500, // 3500.00

      functionId: this.funcionSeleccionada?.id, // 2
      seats: ["A1", "C3"] // ["A1","C3"]
    });

    this.router.navigate(['/ticket/step4']);
  }

  volverAtras(): void {
    this.location.back();
  }

  // Formatear fecha: "YYYY-MM-DD" → "11 de septiembre"
  formatearFecha(fecha: string): string {
    const [year, month, day] = fecha.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day); // esto usa la zona local
    const opciones: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
    return dateObj.toLocaleDateString('es-ES', opciones);
  }

  // Formatear hora: "HH:mm:ss" → "HH:mm"
  formatearHora(hora: string): string {
    return hora.slice(0, 5); // corta los segundos
  }

}