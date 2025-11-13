import { Injectable } from '@angular/core';
import Movie from '../../models/movie';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../AuthService/auth-service';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  
  movies : Movie[]
  moviesCartelera: Movie[]
  selectedPelicula: Movie | undefined;

  moviesBd: Movie[]

  constructor (private http: HttpClient, private authService: AuthService){
    this.movies = []
    this.moviesCartelera = []
    this.moviesBd = []
  }

  //METODOS GET
  getMovie(id:string){
    return this.http.get<Movie>(`/api/movies/${id}`);
  }
  
  getMovieByName(name:string){
    return this.http.get<Movie[]>(`/api/movies/search?title=${name}`);
  }
  
  getMovies(){
    return this.http.get<Movie[]>('/api/movies')
  }
  
  getAllMoviesBd(){
    return this.http.get<Movie[]>(`/api/movies/bd`)
  }

  getMovieBd(id:string){
    return this.http.get<Movie>(`/api/movies/bd/${id}`);
  }

  //LIMPIAR ARRAY
  vaciarMovies(){
    this.movies = [];
  }

  //METODO POST
  postMovie(id : string){
    if(!this.authService.isAdmin()){
      // Si no es admin, lanza un error inmediatamente y no hace la petición.
      console.error('Se requiere rol ADMIN.');
      return throwError(() => new Error('Acceso Denegado: Rol insuficiente.'));
    }
    return this.http.post<Movie>(`/api/movies/save/${id}`,null);
  }

  //METODO DELETE
  deleteMovie(id:string){
    return this.http.delete<Movie>(`/api/movies/delete/${id}`)
  }


  selectedMovie(movie : Movie){
    this.selectedPelicula = movie;
  }

  updateMovie(id: string, movie: Movie) {
    if (!this.authService.isAdmin()) {
      console.error('Se requiere rol ADMIN.');
      return throwError(() => new Error('Acceso Denegado: Rol insuficiente.'));
    } 
    return this.http.put<Movie>(`/api/movies/update/${id}`, movie);
  }



}