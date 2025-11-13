import { Component, signal, WritableSignal } from '@angular/core';
import { Pelicula } from '../../models/pelicula';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from '../../services/ticket/ticket-service';
import { Location } from '@angular/common';
import { MovieService } from '../../services/movie/movie-service';
import Movie from '../../models/movie';
import { Funcion } from '../../models/funcion';
import { FunctionService } from '../../services/function/function-service';
import { ErrorHandler } from '../../services/ErrorHandler/error-handler';

@Component({
  selector: 'app-movie-details',
  imports: [],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.css',
})
export class MovieDetails {

  movieId: number | undefined;
  peliculaSeleccionada: Movie | undefined;
  funciones: Funcion[] | undefined;

  // Signal para mostrar mensajes de error en la UI (reemplaza alert)
  errorMessage: WritableSignal<string | null> = signal(null);

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    public movieService: MovieService,
    public ticketService: TicketService,
    private functionService: FunctionService,
    private errorHandlerService: ErrorHandler
  ) { }

  ngOnInit(): void {
    // Obtener el parámetro de la ruta (movieId)
    this.route.params.subscribe(params => {
      this.movieId = +params['id'];
      if (this.movieId) {
        // Pide al servicio que busque y almacene la pelicula
        this.traerPeliculaPorId(this.movieId.toString())
        this.traerFuncionesPorPeliculaId(this.movieId);

      } else {
        console.error('No hay película seleccionada para navegar.');
      }
    });
  }

  traerPeliculaPorId(id: string) {
    this.movieService.getMovieBd(id).subscribe({
      next: (data) => { this.peliculaSeleccionada = data },
      error: (e) => { this.errorHandlerService.handleHttpError(e) }
    })
  }

  traerFuncionesPorPeliculaId(id: number) {
    this.functionService.getDisponiblesPorPelicula(id).subscribe({
      next: (data) => {
        // Ordenar las funciones desde (la mas temprana) y (la mas lejana)
        this.funciones = data.sort((f1, f2) => {
          return new Date(f1.date).getTime() - new Date(f2.date).getTime();
        });
      },
      error: (e) => { console.log("Error: " + e) }
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