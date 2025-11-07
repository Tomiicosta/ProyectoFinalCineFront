import { Injectable } from '@angular/core';
import Movie from '../../models/movie';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  
  movies : Movie[]
  moviesCartelera: Movie[]

  constructor (private http: HttpClient){
    this.movies = []
    this.moviesCartelera = []
  }

  getMovie(id:string){
    return this.http.get<Movie>(`/api/movies/${id}`);
  }
  
  getMovieByName(name:string){
    return this.http.get<Movie[]>(`/api/movies/search?title=${name}`);
  }

  vaciarMovies(){
    this.movies = [];
  }

  postMovie(id : string){
    return this.http.post<Movie>(`/api/movies/save/${id}`,null);
  }

  getMovies(){
    return this.http.get<Movie[]>("/api/movies");
  }

  deleteMovie(id:string){
    return this.http.delete<Movie>(`${this.API_URL}/delete/${id}`)
  }
}
