import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from '../../services/ticket-service';
import { AsyncPipe, NgClass } from '@angular/common';
import { Observable } from 'rxjs';
import { Pelicula } from '../../models/pelicula';
import { Butaca } from '../../models/butaca';

@Component({
  selector: 'app-ticket-step3',
  imports: [AsyncPipe, NgClass],
  templateUrl: './ticket-step3.html',
  styleUrl: './ticket-step3.css',
})
export class TicketStep3 implements OnInit {

  // (CAMBIAR CON DATOS DE LA BDD) Puedes simular el mapa de butacas
  mapaButacas: Butaca[][] = [
    // Fila A
    [{ id: 'A1', fila: 'A', columna: 1, estado: 'ocupada', hover: false }, { id: 'A2', fila: 'A', columna: 2, estado: 'disponible', hover: false }, { id: 'A3', fila: 'A', columna: 3, estado: 'disponible', hover: false },],
    // Fila B
    [{ id: 'B1', fila: 'B', columna: 1, estado: 'disponible', hover: false }, { id: 'B2', fila: 'B', columna: 2, estado: 'disponible', hover: false }, { id: 'B3', fila: 'B', columna: 3, estado: 'disponible', hover: false },],
    // ...
  ];

  butacasSeleccionadas: Butaca[] = [];

  movieId: number | undefined;

  peliculaSeleccionada$!: Observable<Pelicula | undefined>;

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
    if (!this.movieId || !this.fecha || !this.hora) return;

    // Guardar todos los datos en el servicio
    this.ticketService.setCompra({
      movieId: this.movieId,
      fecha: this.fecha,
      hora: this.hora,
      butacas: this.butacasSeleccionadas
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

  // Método para manejar el click en una butaca
  seleccionarButaca(butaca: Butaca): void {
    // Solo permite la selección si está disponible
    if (butaca.estado === 'disponible') {
      butaca.estado = 'seleccionada';
      this.butacasSeleccionadas.push(butaca);
    }
    // Permite deseleccionar
    else if (butaca.estado === 'seleccionada') {
      butaca.estado = 'disponible';
      // Eliminar del array de seleccionadas
      this.butacasSeleccionadas = this.butacasSeleccionadas.filter(b => b.id !== butaca.id);
    }
    // No hace nada si el estado es 'ocupada'
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
