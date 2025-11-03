import { Component, computed, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from '../../services/ticket-service';
import { NgClass } from '@angular/common';
import { Pelicula } from '../../models/pelicula';
import { Butaca } from '../../models/butaca';

@Component({
  selector: 'app-ticket-step3',
  imports: [NgClass],
  templateUrl: './ticket-step3.html',
  styleUrl: './ticket-step3.css',
})
export class TicketStep3 implements OnInit {

  // (CAMBIAR CON DATOS DE LA BDD) Puedes simular el mapa de butacas
  // Estado del Mapa de Butacas (Usando Signal)
  mapaButacas: WritableSignal<Butaca[][]> = signal([
    // Fila A
    [{ id: 'A1', fila: 'A', columna: 1, estado: 'disponible', hover: false },
    { id: 'A2', fila: 'A', columna: 2, estado: 'disponible', hover: false },
    { id: 'A3', fila: 'A', columna: 3, estado: 'disponible', hover: false },
    { id: 'A4', fila: 'A', columna: 4, estado: 'disponible', hover: false },
    { id: 'A5', fila: 'A', columna: 5, estado: 'ocupada', hover: false },
    { id: 'A6', fila: 'A', columna: 6, estado: 'ocupada', hover: false },
    { id: 'A7', fila: 'A', columna: 7, estado: 'disponible', hover: false },
    { id: 'A8', fila: 'A', columna: 8, estado: 'disponible', hover: false },
    { id: 'A9', fila: 'A', columna: 9, estado: 'disponible', hover: false },
    { id: 'A10', fila: 'A', columna: 10, estado: 'disponible', hover: false },
    { id: 'A11', fila: 'A', columna: 11, estado: 'disponible', hover: false },
    { id: 'A12', fila: 'A', columna: 12, estado: 'disponible', hover: false },
    { id: 'A13', fila: 'A', columna: 13, estado: 'disponible', hover: false },
    { id: 'A14', fila: 'A', columna: 14, estado: 'disponible', hover: false },
    { id: 'A15', fila: 'A', columna: 15, estado: 'disponible', hover: false },
    { id: 'A16', fila: 'A', columna: 16, estado: 'disponible', hover: false },
    { id: 'A17', fila: 'A', columna: 17, estado: 'disponible', hover: false },
    { id: 'A18', fila: 'A', columna: 18, estado: 'disponible', hover: false },
    { id: 'A19', fila: 'A', columna: 19, estado: 'disponible', hover: false },
    { id: 'A20', fila: 'A', columna: 20, estado: 'disponible', hover: false },],
    // Fila B
    [{ id: 'B1', fila: 'B', columna: 1, estado: 'disponible', hover: false },
    { id: 'B2', fila: 'B', columna: 2, estado: 'disponible', hover: false },
    { id: 'B3', fila: 'B', columna: 3, estado: 'disponible', hover: false },
    { id: 'B4', fila: 'B', columna: 4, estado: 'disponible', hover: false },
    { id: 'B5', fila: 'B', columna: 5, estado: 'disponible', hover: false },
    { id: 'B6', fila: 'B', columna: 6, estado: 'disponible', hover: false },
    { id: 'B7', fila: 'B', columna: 7, estado: 'disponible', hover: false },
    { id: 'B8', fila: 'B', columna: 8, estado: 'disponible', hover: false },
    { id: 'B9', fila: 'B', columna: 9, estado: 'disponible', hover: false },
    { id: 'B10', fila: 'B', columna: 10, estado: 'disponible', hover: false },
    { id: 'B11', fila: 'B', columna: 11, estado: 'disponible', hover: false },
    { id: 'B12', fila: 'B', columna: 12, estado: 'disponible', hover: false },
    { id: 'B13', fila: 'B', columna: 13, estado: 'disponible', hover: false },
    { id: 'B14', fila: 'B', columna: 14, estado: 'disponible', hover: false },
    { id: 'B15', fila: 'B', columna: 15, estado: 'disponible', hover: false },
    { id: 'B16', fila: 'B', columna: 16, estado: 'disponible', hover: false },
    { id: 'B17', fila: 'B', columna: 17, estado: 'disponible', hover: false },
    { id: 'B18', fila: 'B', columna: 18, estado: 'disponible', hover: false },
    { id: 'B19', fila: 'B', columna: 19, estado: 'disponible', hover: false },
    { id: 'B20', fila: 'B', columna: 20, estado: 'disponible', hover: false },],
    // Fila C
    [{ id: 'C1', fila: 'C', columna: 1, estado: 'disponible', hover: false },
    { id: 'C2', fila: 'C', columna: 2, estado: 'disponible', hover: false },
    { id: 'C3', fila: 'C', columna: 3, estado: 'disponible', hover: false },
    { id: 'C4', fila: 'C', columna: 4, estado: 'disponible', hover: false },
    { id: 'C5', fila: 'C', columna: 5, estado: 'disponible', hover: false },
    { id: 'C6', fila: 'C', columna: 6, estado: 'disponible', hover: false },
    { id: 'C7', fila: 'C', columna: 7, estado: 'disponible', hover: false },
    { id: 'C8', fila: 'C', columna: 8, estado: 'disponible', hover: false },
    { id: 'C9', fila: 'C', columna: 9, estado: 'disponible', hover: false },
    { id: 'C10', fila: 'C', columna: 10, estado: 'disponible', hover: false },
    { id: 'C11', fila: 'C', columna: 11, estado: 'disponible', hover: false },
    { id: 'C12', fila: 'C', columna: 12, estado: 'disponible', hover: false },
    { id: 'C13', fila: 'C', columna: 13, estado: 'ocupada', hover: false },
    { id: 'C14', fila: 'C', columna: 14, estado: 'ocupada', hover: false },
    { id: 'C15', fila: 'C', columna: 15, estado: 'ocupada', hover: false },
    { id: 'C16', fila: 'C', columna: 16, estado: 'disponible', hover: false },
    { id: 'C17', fila: 'C', columna: 17, estado: 'disponible', hover: false },
    { id: 'C18', fila: 'C', columna: 18, estado: 'disponible', hover: false },
    { id: 'C19', fila: 'C', columna: 19, estado: 'disponible', hover: false },
    { id: 'C20', fila: 'C', columna: 20, estado: 'disponible', hover: false },],
    // Fila D
    [{ id: 'D1', fila: 'D', columna: 1, estado: 'disponible', hover: false },
    { id: 'D2', fila: 'D', columna: 2, estado: 'disponible', hover: false },
    { id: 'D3', fila: 'D', columna: 3, estado: 'disponible', hover: false },
    { id: 'D4', fila: 'D', columna: 4, estado: 'ocupada', hover: false },
    { id: 'D5', fila: 'D', columna: 5, estado: 'ocupada', hover: false },
    { id: 'D6', fila: 'D', columna: 6, estado: 'ocupada', hover: false },
    { id: 'D7', fila: 'D', columna: 7, estado: 'ocupada', hover: false },
    { id: 'D8', fila: 'D', columna: 8, estado: 'disponible', hover: false },
    { id: 'D9', fila: 'D', columna: 9, estado: 'disponible', hover: false },
    { id: 'D10', fila: 'D', columna: 10, estado: 'disponible', hover: false },
    { id: 'D11', fila: 'D', columna: 11, estado: 'disponible', hover: false },
    { id: 'D12', fila: 'D', columna: 12, estado: 'disponible', hover: false },
    { id: 'D13', fila: 'D', columna: 13, estado: 'disponible', hover: false },
    { id: 'D14', fila: 'D', columna: 14, estado: 'disponible', hover: false },
    { id: 'D15', fila: 'D', columna: 15, estado: 'disponible', hover: false },
    { id: 'D16', fila: 'D', columna: 16, estado: 'disponible', hover: false },
    { id: 'D17', fila: 'D', columna: 17, estado: 'disponible', hover: false },
    { id: 'D18', fila: 'D', columna: 18, estado: 'disponible', hover: false },
    { id: 'D19', fila: 'D', columna: 19, estado: 'disponible', hover: false },
    { id: 'D20', fila: 'D', columna: 20, estado: 'disponible', hover: false },],
    // Fila E
    [{ id: 'E1', fila: 'E', columna: 1, estado: 'disponible', hover: false },
    { id: 'E2', fila: 'E', columna: 2, estado: 'disponible', hover: false },
    { id: 'E3', fila: 'E', columna: 3, estado: 'disponible', hover: false },
    { id: 'E4', fila: 'E', columna: 4, estado: 'disponible', hover: false },
    { id: 'E5', fila: 'E', columna: 5, estado: 'disponible', hover: false },
    { id: 'E6', fila: 'E', columna: 6, estado: 'disponible', hover: false },
    { id: 'E7', fila: 'E', columna: 7, estado: 'disponible', hover: false },
    { id: 'E8', fila: 'E', columna: 8, estado: 'disponible', hover: false },
    { id: 'E9', fila: 'E', columna: 9, estado: 'disponible', hover: false },
    { id: 'E10', fila: 'E', columna: 10, estado: 'disponible', hover: false },
    { id: 'E11', fila: 'E', columna: 11, estado: 'disponible', hover: false },
    { id: 'E12', fila: 'E', columna: 12, estado: 'disponible', hover: false },
    { id: 'E13', fila: 'E', columna: 13, estado: 'disponible', hover: false },
    { id: 'E14', fila: 'E', columna: 14, estado: 'disponible', hover: false },
    { id: 'E15', fila: 'E', columna: 15, estado: 'disponible', hover: false },
    { id: 'E16', fila: 'E', columna: 16, estado: 'disponible', hover: false },
    { id: 'E17', fila: 'E', columna: 17, estado: 'disponible', hover: false },
    { id: 'E18', fila: 'E', columna: 18, estado: 'disponible', hover: false },
    { id: 'E19', fila: 'E', columna: 19, estado: 'disponible', hover: false },
    { id: 'E20', fila: 'E', columna: 20, estado: 'ocupada', hover: false },],
    // Fila F
    [{ id: 'F1', fila: 'F', columna: 1, estado: 'disponible', hover: false },
    { id: 'F2', fila: 'F', columna: 2, estado: 'disponible', hover: false },
    { id: 'F3', fila: 'F', columna: 3, estado: 'disponible', hover: false },
    { id: 'F4', fila: 'F', columna: 4, estado: 'disponible', hover: false },
    { id: 'F5', fila: 'F', columna: 5, estado: 'disponible', hover: false },
    { id: 'F6', fila: 'F', columna: 6, estado: 'disponible', hover: false },
    { id: 'F7', fila: 'F', columna: 7, estado: 'disponible', hover: false },
    { id: 'F8', fila: 'F', columna: 8, estado: 'disponible', hover: false },
    { id: 'F9', fila: 'F', columna: 9, estado: 'disponible', hover: false },
    { id: 'F10', fila: 'F', columna: 10, estado: 'disponible', hover: false },
    { id: 'F11', fila: 'F', columna: 11, estado: 'ocupada', hover: false },
    { id: 'F12', fila: 'F', columna: 12, estado: 'ocupada', hover: false },
    { id: 'F13', fila: 'F', columna: 13, estado: 'ocupada', hover: false },
    { id: 'F14', fila: 'F', columna: 14, estado: 'ocupada', hover: false },
    { id: 'F15', fila: 'F', columna: 15, estado: 'disponible', hover: false },
    { id: 'F16', fila: 'F', columna: 16, estado: 'disponible', hover: false },
    { id: 'F17', fila: 'F', columna: 17, estado: 'disponible', hover: false },
    { id: 'F18', fila: 'F', columna: 18, estado: 'disponible', hover: false },
    { id: 'F19', fila: 'F', columna: 19, estado: 'disponible', hover: false },
    { id: 'F20', fila: 'F', columna: 20, estado: 'disponible', hover: false },],
  ]);

  // Signal para mostrar mensajes de error en la UI (reemplaza alert)
  errorMessage: WritableSignal<string | null> = signal(null);

  // Asientos Seleccionados (Usando Signal)
  butacasSeleccionadas: WritableSignal<Butaca[]> = signal(
    this.mapaButacas().flat().filter(b => b.estado === 'seleccionada')
  );

  // Propiedades computadas para la UI
  totalButacasSeleccionadas = computed(() => this.butacasSeleccionadas().length);

  movieId: number | undefined;
  peliculaSeleccionada: Pelicula | undefined;

  fecha: string | null = null;
  hora: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService
  ) { }

  ngOnInit(): void {
    // 1. Obtener el parámetro de la ruta (movieId)
    this.route.params.subscribe(params => {
      this.movieId = +params['id'];

      if (this.movieId) {
        // 3. Pide al servicio que busque y almacene la peli
        this.ticketService.loadPeliculaActual(this.movieId);
        this.peliculaSeleccionada = this.ticketService.getPeliculaSnapshot();

      } else {
        console.error('No hay película seleccionada para navegar.');
      }
    });

    // 2. Obtener los Query Parameters (fecha, hora)
    this.route.queryParams.subscribe(params => {
      this.fecha = params['fecha'];
      this.hora = params['hora'];
      console.log(`Película: ${this.movieId}, Función: ${this.fecha} a las ${this.hora}`);

      // Aquí podrías cargar el mapa de butacas para esa función
    });
  }

  confirmarPaso3() {
    this.errorMessage.set(null); // Limpiar cualquier error previo

    if (!this.movieId || !this.fecha || !this.hora) return;

    if (this.totalButacasSeleccionadas() === 0) { 
      // Reemplazo de alert() por el signal de error
      this.errorMessage.set("ERROR: Seleccione al menos una butaca para continuar.");
      return;
    }

    // Guardar todos los datos en el servicio
    this.ticketService.setCompra({
      movieId: this.movieId,
      fecha: this.fecha,
      hora: this.hora,
      butacas: this.butacasSeleccionadas(), 
      cantButacas: this.totalButacasSeleccionadas(),
      precioUnidad: 2500 // hardcodeo (CAMBIAR)
    });

    // Navegar a la página final de compra sin parámetros
    this.router.navigate(['/ticket/step4']);
  }

  volverPaso2() {
    // Para obtener el ID para la navegación, puedes usar el snapshot del servicio:
    const peli = this.ticketService.getPeliculaSnapshot();

    if (!peli) return;

    this.router.navigate(['/ticket/step2', peli.id]);
  }

  listaButacasSeleccionadas = computed(() => 
    this.butacasSeleccionadas().map(b => b.id).join(', ')
  );

  // Método para manejar el click en una butaca
  seleccionarButaca(butaca: Butaca): void {
    // Para actualizar un signal de forma reactiva, debemos usar .set() o .update()
    // y no modificar el array subyacente directamente.

    if (butaca.estado === 'disponible') {
      // 1. Clonar el mapa de butacas para encontrar y marcar la butaca
      this.mapaButacas.update(mapa => {
        const updatedMap = mapa.map(fila => fila.map(b => {
          if (b.id === butaca.id) {
            return { ...b, estado: 'seleccionada' as Butaca['estado'] };
          }
          return b;
        }));
        // 2. Devolver el nuevo mapa inmutable
        return updatedMap;
      });

    } else if (butaca.estado === 'seleccionada') {
      // 1. Clonar el mapa de butacas para encontrar y desmarcar la butaca
      this.mapaButacas.update(mapa => {
        const updatedMap = mapa.map(fila => fila.map(b => {
          if (b.id === butaca.id) {
            return { ...b, estado: 'disponible' as Butaca['estado'] };
          }
          return b;
        }));
        return updatedMap;
      });
    }

    // 3. Recalcular y actualizar el signal de butacasSeleccionadas a partir del mapa.
    this.butacasSeleccionadas.set(
      this.mapaButacas().flat().filter(b => b.estado === 'seleccionada')
    );
  }

  // Nuevo método para limpiar todas las butacas seleccionadas
  limpiarButacasSeleccionadas(): void {
    // 1. Actualizar el mapa de butacas: Cambiar todas las 'seleccionada' a 'disponible'
    this.mapaButacas.update(mapa => {
      // Usamos map() para asegurar la inmutabilidad de los objetos y arrays
      return mapa.map(fila => fila.map(butaca => {
        if (butaca.estado === 'seleccionada') {
          // Devolvemos una copia de la butaca con el estado modificado
          return { ...butaca, estado: 'disponible' as Butaca['estado'] };
        }
        return butaca; // Mantenemos las butacas 'ocupada' y 'disponible'
      }));
    });

    // 2. Limpiar el Signal de butacas seleccionadas
    this.butacasSeleccionadas.set([]);
  }

  // Métodos para manejar el efecto hover
  onMouseEnter(butaca: Butaca): void {
    if (butaca.estado === 'disponible') {
      butaca.hover = true;
    }
  }
  onMouseLeave(butaca: Butaca): void {
    butaca.hover = false;
  }

}
