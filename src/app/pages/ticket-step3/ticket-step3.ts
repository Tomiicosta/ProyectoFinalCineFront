import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from '../../services/ticket-service';

@Component({
  selector: 'app-ticket-step3',
  imports: [],
  templateUrl: './ticket-step3.html',
  styleUrl: './ticket-step3.css',
})
export class TicketStep3 implements OnInit {

  movieId: number | undefined;
  fecha: string | null = null;
  hora: string | null = null;

  butacasSeleccionadas: { fila: number, columna: number }[] = [
    { fila: 5, columna: 10 }, // Ejemplo
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService
  ) { }

  ngOnInit(): void {
    // 1. Obtener el parámetro de la ruta (movieId)
    this.route.params.subscribe(params => {
      this.movieId = +params['movieId'];
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

}
