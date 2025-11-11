import { Component, signal, WritableSignal } from '@angular/core';
import { Pelicula } from '../../models/pelicula';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from '../../services/ticket/ticket-service';
import { Location } from '@angular/common';
import { MovieService } from '../../services/movie/movie-service';
import Movie from '../../models/movie';

@Component({
  selector: 'app-movie-details',
  imports: [],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.css',
})
export class MovieDetails {

  movieId: number | undefined;
  peliculaSeleccionada: Movie | undefined;
  // Signal para mostrar mensajes de error en la UI (reemplaza alert)
  errorMessage: WritableSignal<string | null> = signal(null);

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    public movieService: MovieService,
    public ticketService: TicketService
  ) { }

  ngOnInit(): void {
    // 1. Obtener el parámetro de la ruta (movieId)
    this.route.params.subscribe(params => {
      this.movieId = +params['id'];
      if (this.movieId) {
        // 3. Pide al servicio que busque y almacene la peli
        this.getSelectedMovieBd(this.movieId.toString())

      } else {
        console.error('No hay película seleccionada para navegar.');
      }
    });
  }

  getSelectedMovieBd(id:string){
    this.movieService.getMovieBd(id).subscribe({
      next:(data)=>{ this.peliculaSeleccionada = data },
      error: (e)=> { console.log(e) }
    })
  }

  // Boton para comprar una entrada de la pelicula
  comprarEntrada() {

    // 2. Usar el servicio para establecer la película como la "actual"
    if (this.peliculaSeleccionada) {
      
      // MANEJAR EXCEPCION SI NO HAY FUNCIONES DE LA PELICULA

      // 3. Navegar al paso 2
      this.ticketService.setPeliculaSeleccionada(this.peliculaSeleccionada);
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