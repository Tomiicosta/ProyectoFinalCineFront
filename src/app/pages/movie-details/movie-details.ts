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
  }

  // Boton para comprar una entrada de la pelicula
  comprarEntrada() {
    // 1. Encontrar la película (o simplemente el ID)
    const peli = this.peliculaSeleccionada;

    // 2. Usar el servicio para establecer la película como la "actual"
    if (peli) {
      this.ticketService.setPeliculaActual(peli);
      // 3. Navegar al paso 2
      this.router.navigate(['/ticket/step2', peli.id]);
    } else {
      console.error('No hay película seleccionada para navegar.');
    }
  }

  volverAtras(): void {
    // El método back() simula hacer clic en el botón "Atrás" del navegador
    this.location.back();
  }

}
