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
  mapaButacas: WritableSignal<Butaca[]> = signal([]);

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

  // Variables no-Signals (se usan solo para datos de navegación/servicio)
  peliculaSeleccionada: Movie | undefined;
  funcionSeleccionada: Funcion | undefined;
  
  // Variable necesaria para el HTML
  String: any;

  constructor(
    private location: Location,
    private router: Router,
    private ticketService: TicketService,
    private functionService: FunctionService
  ) { }

  ngOnInit(): void {
    // La lógica de inicialización y carga del servicio se mantiene
    this.peliculaSeleccionada = this.ticketService.getPeliculaSeleccionada();
    this.funcionSeleccionada = this.ticketService.getFuncion();

    if (!this.peliculaSeleccionada) return;
    if (!this.funcionSeleccionada) return;

    this.functionService.getSeatsByFunction(this.funcionSeleccionada.id)
      .subscribe({
        next: (butacas) =>{ this.mapaButacas.set(butacas); console.log("data Seats:", butacas) },
        error: (err) => console.error('Error al cargar butacas:', err)
      });
  }

  /**
   * Método para manejar el click en una butaca disponible.
   * Ahora SÓLO modifica el signal `butacasSeleccionadas`.
   * @param butaca La butaca clickeada.
   */
  seleccionarButaca(butaca: Butaca): void {
    if (butaca.occupied) {
      // Las butacas ocupadas no se pueden seleccionar.
      this.errorMessage.set("ERROR: La butaca ya está ocupada.");
      return;
    }

    this.errorMessage.set(null); // Limpiar error si la selección es válida

    // Usamos el ID para saber si ya está seleccionada.
    const isSelected = this.butacasSeleccionadas().some(b => b.id === butaca.id);

    this.butacasSeleccionadas.update(currentSelections => {
      if (isSelected) {
        // Si está seleccionada, la quitamos (deseleccionar)
        return currentSelections.filter(b => b.id !== butaca.id);
      } else {
        // Si no está seleccionada, la agregamos (seleccionar)
        return [...currentSelections, butaca];
      }
    });
  }

  /**
   * Método para verificar si una butaca está seleccionada (para NgClass)
   */
  isButacaSeleccionada(butaca: Butaca): boolean {
    return this.butacasSeleccionadas().some(b => b.id === butaca.id);
  }

  /**
   * Limpia todas las butacas seleccionadas.
   */
  limpiarButacasSeleccionadas(): void {
    // Simplemente vaciamos el Signal de butacas seleccionadas. ¡Mucho más sencillo!
    this.butacasSeleccionadas.set([]);
    this.errorMessage.set(null);
  }

  confirmarPaso3(): void {
    // Lógica de confirmación:
    if (this.totalButacasSeleccionadas() === 0) {
      this.errorMessage.set("ERROR: Seleccione al menos una butaca para continuar.");
      return;
    }

    // El resto de la lógica de guardado y navegación se mantiene igual
    /*
    this.ticketService.setCompra({
      movieId: this.peliculaSeleccionada!.id,
      fecha: this.funcionSeleccionada!.date,
      hora: "guarda dani te hardcodee esto para no tener kilombo",
      butacas: this.butacasSeleccionadas(),
      cantButacas: this.totalButacasSeleccionadas(),
      precioUnidad: 2500 // hardcodeo (CAMBIAR)
    });
    */
    this.router.navigate(['/ticket/step4']);
  }

  volverAtras(): void {
    this.location.back();
  }

  // ** NOTA: Los métodos onMouseEnter y onMouseLeave se han ELIMINADO **
  // La funcionalidad de hover se gestionará completamente en el CSS.
}