import { Injectable, signal } from '@angular/core';
import { Pelicula } from '../../models/pelicula';
import { BehaviorSubject, Observable } from 'rxjs';
import { Compra } from '../../models/compra';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Funcion } from '../../models/funcion';
import { MovieService } from '../movie/movie-service';
import Movie from '../../models/movie';
import { Sala } from '../../models/sala';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  // Lista de peliculas (TRAER DESDE LA API PELICULAS)
  public peliculas: Movie[] = [];

  // Index de tarjeta PASO 1 comprar ticket
  indexPelicula = 2;
  peliculaSeleccionada: Movie | undefined;

  compraActual: Compra | undefined;

  funcionActual: Funcion | undefined;

  salaActual: Sala | undefined;

  constructor(private http: HttpClient,
    private movieService: MovieService
  ) { }

  setCompra(compra: Compra | undefined): void {
    this.compraActual = compra;
    localStorage.setItem("compra", JSON.stringify(compra));
  }

  getCompra(): Compra | undefined {
    return this.compraActual;
  }

  setFuncion(funcion: Funcion | undefined): void {
    this.funcionActual = funcion;
    localStorage.setItem("funcion", JSON.stringify(funcion));
  }

  getFuncion(): Funcion | undefined {
    return this.funcionActual;
  }

  setSala(sala: Sala | undefined): void {
    this.salaActual = sala;
    localStorage.setItem("sala", JSON.stringify(sala));
  }

  getSala(): Sala | undefined {
    return this.salaActual;
  }

  setPeliculaSeleccionada(pelicula: Movie | undefined): void {
    this.peliculaSeleccionada = pelicula;
    localStorage.setItem("peliculaSeleccionada", JSON.stringify(pelicula));
  }
  
  getPeliculaSeleccionada(): Movie | undefined {
    return this.peliculaSeleccionada;
  }

  getPeliculas(): Movie[] {
    return this.peliculas;
  }

  // Funcion IDEAL para URLs que vengan con un parametro /:id
  getPeliculaById(id: number): Movie | undefined {
    return this.peliculas.find(p => p.id === id);
  }

  // Realiza un llamado a getPeliculasApi() y lo guarda en el array
  public actualizarListaPeliculas(): void {
    this.movieService.getMovies().subscribe({
      next: (data) => {
        // Almacena los datos recibidos en la variable privada
        this.peliculas = data;
        console.log('Películas cargadas y almacenadas:', this.peliculas);
      },
      error: (error) => {
        console.error('Error al obtener las películas:', error);
        // Manejo de errores de la API (ej. token expirado, 403 Forbidden, 404 Not Found)
      }
    });
  }

}