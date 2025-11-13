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
    private cinemaService: CinemaService
  ) { }

  ngOnInit(): void {
    // La lógica de inicialización es NECESARIA para que no se cargue el HTML antes que el mapa de butacas
    this.peliculaSeleccionada = this.ticketService.getPeliculaSeleccionada();
    this.funcionSeleccionada = this.ticketService.getFuncion();

    if (!this.peliculaSeleccionada || !this.funcionSeleccionada) return;

    //console.log("DATA TicketService getPeliculaSeleccionada = ",this.peliculaSeleccionada);
    //console.log("DATA TicketService getFuncion = ",this.funcionSeleccionada);

    // Recibe la Sala por Funcion
    this.cinemaService.getSala(this.funcionSeleccionada.cinemaId).subscribe({
      next: (data) => {
        this.ticketService.setSala(data);
        //console.log("DATA CinemaService getSala = ",data);
      },
      error: (e) => { console.error("ERROR CinemaService getSala = ", e) }
    });

    // if (!this.ticketService.salaActual) return; // ESTA MIERDA BUGEA TODO EL MAPA DE BUTACAS Y NO LO MUESTRA Q_Q

    // Recibe las Butacas por Funcion
    this.functionService.getSeatsByFunction(this.funcionSeleccionada.id)
      .subscribe({
        next: (butacas) => {
          //console.log("DATA FunctionService getSeatsByFunction = ", butacas);

          // Agrupar las butacas por fila
          const matrizButacas: Butaca[][] = Array.from({ length: this.ticketService.salaActual?.rowSeat || 0 }, () =>
            Array(this.ticketService.salaActual?.columnSeat || 0).fill(null)
          );

          for (const b of butacas) {
            const rowIndex = b.rowNumber - 1; // restamos 1 si las filas empiezan desde 1
            const colIndex = b.columnNumber - 1;
            matrizButacas[rowIndex][colIndex] = b;
          }

          //console.log("DATA matrizButacas = ",matrizButacas);

          this.mapaButacas.set(matrizButacas);

          //console.log("DATA mapaButacas = ",this.mapaButacas);
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
    // CAMBIAR ESTO PARA REALIZAR LA ORDEN DE COMPRA, CON EL DTO QUE MANDO SEBAS AL WPP
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

  // Formatear butaca.rowNumber a un indice de fila "A","B","C",etc..
  getFilaLetra(rowNumber?: number): string {
    if (rowNumber == null) return '';           // retorna vacío si no hay dato
    return String.fromCharCode(64 + rowNumber); // rowNumber es 1-based -> 1 => 'A'
  }

  // Formatear fecha: "YYYY-MM-DD" → "viernes 14 de noviembre"
  formatearFecha(fecha: string): string {
    const [year, month, day] = fecha.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);

    const opciones: Intl.DateTimeFormatOptions = {
      weekday: 'long',  // agrega el día de la semana
      day: 'numeric',
      month: 'long'
    };

    // Esto devuelve algo como: "viernes, 14 de noviembre"
    const fechaFormateada = dateObj.toLocaleDateString('es-ES', opciones);
    // Eliminamos la coma y capitalizamos la primera letra
    return fechaFormateada.replace(',', '');
  }

  // Formatear hora: "HH:mm:ss" → "HH:mm"
  formatearHora(hora: string): string {
    return hora.slice(0, 5); // corta los segundos
  }

}