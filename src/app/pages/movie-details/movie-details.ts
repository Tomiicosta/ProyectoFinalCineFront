import { Component, signal, WritableSignal } from '@angular/core';
import { Pelicula } from '../../models/pelicula';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from '../../services/ticket-service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-movie-details',
  imports: [],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.css',
})
export class MovieDetails {

  movieId: number | undefined;
  peliculaSeleccionada: Pelicula | undefined;
  // Signal para mostrar mensajes de error en la UI (reemplaza alert)
  errorMessage: WritableSignal<string | null> = signal(null);

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService
  ) { }

  ngOnInit(): void {
    // Obtener el parámetro de la ruta (movieId)
    this.route.params.subscribe(params => {
      this.movieId = +params['id'];
      if (this.movieId) {

        this.ticketService.actualizarListaPeliculas();
        // Pide al servicio que busque la peli
        this.peliculaSeleccionada = this.ticketService.getPeliculaById(this.movieId);

      } else {
        console.error('No hay película seleccionada para navegar.');
      }
    });
  }

  // Boton para comprar una entrada de la pelicula
  comprarEntrada() {
    // Encontrar la película
    const peli = this.peliculaSeleccionada;

    // Usar el servicio para establecer la película como la "actual"
    if (peli) {
      this.ticketService.setPeliculaActual(peli);
      // Navegar al paso 2
      this.router.navigate(['/ticket/step2']);
    } else {
      console.error('No hay película seleccionada para navegar.');
    }
  }

  volverAtras(): void {
    // El método back() simula hacer clic en el botón "Atrás" del navegador
    this.location.back();
  }

}
