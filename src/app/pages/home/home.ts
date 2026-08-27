import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MovieService } from '../../services/movie/movie-service';
import { Router } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { ErrorHandler } from '../../services/ErrorHandler/error-handler';
import { FunctionService } from '../../services/function/function-service';
import { Funcion } from '../../models/funcion';
import Movie from '../../models/movie';

@Component({
  selector: 'app-home',
  imports: [SlicePipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {

  localDate: Date = new Date();
  indiceActual = 0;
  autoScrollCartelera!: any;
  autoScrollEstrenos!: any;
  funciones: Funcion[] = [];

  @ViewChild('carruselEstrenos', { static: false }) carruselEstrenos!: ElementRef;
  @ViewChild('carruselCartelera', { static: false }) carruselCartelera!: ElementRef;

  constructor(
    private router: Router,
    public movieService: MovieService,
    private errorHandlerService: ErrorHandler,
    private functionService: FunctionService
  ) {}

  // 🟢 Obtener todas las películas
  getAllMovies() {
    this.movieService.getMovies().subscribe({
      next: (data) => { this.movieService.moviesCartelera = data  || []},
      error: (e) => { this.errorHandlerService.handleHttpError(e);
        this.movieService.moviesCartelera = [];
      }
    });
  }

  // 🟢 Obtener todas las funciones (para saber qué películas tienen próximas funciones)
  getFunciones() {
    this.functionService.getFunciones().subscribe({
      next: (data) => { this.funciones = data || []; },
      error: (e) => { this.funciones = []; }
    });
  }

  // 🟢 Próximos estrenos = películas con al menos una función futura cargada
  get upcomingMovies(): Movie[] {
    const movies = this.movieService.moviesCartelera || [];

    const movieIdsConFuncionFutura = new Set(
      this.funciones
        .filter(funcion => this.esFuncionFutura(funcion))
        .map(funcion => funcion.movieId)
    );

    return movies.filter(movie =>
      movie?.id !== undefined && movieIdsConFuncionFutura.has(movie.id)
    );
  }


  // 🟢 Ver detalles
  verDetalles(id: number | undefined) {
    if (id !== undefined) this.router.navigate(['/details', id]);
  }

  // 🟢 Carrusel principal
  siguiente() {
  const movies = this.movieService.moviesCartelera || [];
  const total = movies.length;

  if (total === 0) return;

  this.indiceActual = (this.indiceActual + 1) % total;
}

anterior() {
  const movies = this.movieService.moviesCartelera || [];
  const total = movies.length;

  if (total === 0) return;

  this.indiceActual = (this.indiceActual - 1 + total) % total;
}


  // 🟢 Verificar si una función todavía no pasó
  private esFuncionFutura(funcion: Funcion): boolean {
    const fechaHora = new Date(`${funcion.date}T${funcion.time}`);
    return fechaHora >= this.localDate;
  }

  // ==============================
  // 🎬 Carrusel de CARTELERA (móvil)
  // ==============================
  moverIzquierdaCartelera() {
    if (!this.carruselCartelera) return;
    const carrusel = this.carruselCartelera.nativeElement;
    carrusel.scrollBy({ left: -200, behavior: 'smooth' });
  }

  moverDerechaCartelera() {
    if (!this.carruselCartelera) return;
    const carrusel = this.carruselCartelera.nativeElement;
    carrusel.scrollBy({ left: 200, behavior: 'smooth' });

    // 🔁 Reiniciar si llega al final
    if (carrusel.scrollLeft + carrusel.clientWidth >= carrusel.scrollWidth - 5) {
      carrusel.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }

  // ==============================
  // 🎥 Carrusel de PRÓXIMOS ESTRENOS
  // ==============================
  moverIzquierdaEstrenos() {
    if (!this.carruselEstrenos) return;
    this.carruselEstrenos.nativeElement.scrollBy({
      left: -200,
      behavior: 'smooth'
    });
  }

  moverDerechaEstrenos() {
    if (!this.carruselEstrenos) return;
    const carrusel = this.carruselEstrenos.nativeElement;
    carrusel.scrollBy({ left: 200, behavior: 'smooth' });

    // 🔁 Reinicio automático (si llega al final)
    if (carrusel.scrollLeft + carrusel.clientWidth >= carrusel.scrollWidth - 5) {
      carrusel.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }

  // ==============================
  // 🕒 Inicialización y auto-scroll
  // ==============================
  ngOnInit() {
    this.getAllMovies();
    this.getFunciones();

      setInterval(() => this.siguiente(), 8000);

    // 🔹 Movimiento automático del carrusel de CARTELERA
    this.autoScrollCartelera = setInterval(() => {
      this.moverDerechaCartelera();
    }, 4000);

    // 🔹 Movimiento automático del carrusel de PRÓXIMOS ESTRENOS
    this.autoScrollEstrenos = setInterval(() => {
      this.moverDerechaEstrenos();
    }, 5000);
    
    
  }

  ngOnDestroy() {
    if (this.autoScrollCartelera) clearInterval(this.autoScrollCartelera);
    if (this.autoScrollEstrenos) clearInterval(this.autoScrollEstrenos);
  }
}
