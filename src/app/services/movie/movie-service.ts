import { Injectable } from '@angular/core';
import Movie from '../../models/movie';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  readonly API_URL = "http://localhost:8080/api/movies"
  
  movies : Movie[]
  moviesCartelera: Movie[]

  constructor (private http: HttpClient){
    this.movies = []
    this.moviesCartelera = []
  }

  getMovie(id:string){
    return this.http.get<Movie>(`${this.API_URL}/${id}`);
  }
  
  getMovieByName(name:string){
    return this.http.get<Movie[]>(`${this.API_URL}/search?title=${name}`);
  }

  vaciarMovies(){
    this.movies = [];
  }

  postMovie(id : string){
    return this.http.post<Movie>(`${this.API_URL}/save/${id}`,null);
  }

  getMovies(){
    return this.http.get<Movie[]>(this.API_URL)
  }

  deleteMovie(id:string){
    return this.http.delete<Movie>(`${this.API_URL}/delete/${id}`)
  }
}
