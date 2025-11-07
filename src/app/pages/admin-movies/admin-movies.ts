import { HttpClient } from '@angular/common/http';
import { Component, input, OnInit } from '@angular/core';
import Movie from '../../models/movie';
import { MovieService } from '../../services/movie/movie-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-movies',
  imports: [FormsModule],
  templateUrl: './admin-movies.html',
  styleUrl: './admin-movies.css',
})
export class AdminMovies implements OnInit{

  idInput: string = '';
  nombreInput: string = '';

  constructor(public movieService: MovieService) {


  }




  getMoviesByName(name:string){
    this.movieService.moviesCartelera = [];
    this.movieService.getMovieByName(name).subscribe({
      next: (data) => { this.movieService.movies = data },
      error: (e) => { console.log(e) }
    })
    this.nombreInput = ''
    this.idInput = ""
    
  }

  manejarEnvio(id:string){
    this.movieService.postMovie(id).subscribe({
      next: (data) => {console.log(data);
      this.getAllMovies();},
      error:(e)=>{console.log(e)}
    })
    this.nombreInput = ''
    this.idInput = ""
  
  }

  getAllMovies(){
    this.movieService.movies = [];
    this.movieService.getMovies().subscribe({
      next: (data) => {this.movieService.moviesCartelera = data},
      error: (e) => {console.log(e)}
    })
    this.nombreInput = ''
    this.idInput = ""
  }


  eliminarDeCartelera(id : string){
    this.movieService.deleteMovie(id);
    this.nombreInput = ''
    this.idInput = ""
  }

  ngOnInit(): void {
    this.getAllMovies();
  }

}
