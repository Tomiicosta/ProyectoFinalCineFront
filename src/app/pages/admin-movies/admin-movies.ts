import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import Movie from '../../models/movie';
import { MovieService } from '../../services/movie/movie-service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/AuthService/auth-service';

@Component({
  selector: 'app-admin-movies',
  imports: [FormsModule],
  templateUrl: './admin-movies.html',
  styleUrl: './admin-movies.css',
})
export class AdminMovies implements OnInit{

  idInput: string = '';
  nombreInput: string = '';
  selectedMovie?: Movie; 
  mostrarAgregar : boolean = false;

  constructor(public movieService: MovieService, public authService: AuthService) {}


  seleccionar(id: string) {
    this.getMovieById(id);
    this.mostrarAgregar = true;
  }


  getMovieById(id:string){
    this.movieService.getMovie(id).subscribe({
      next: (data) => { this.selectedMovie = data;},
      error: (e) => { console.log(e) }
    })
  }


  getMoviesByName(name:string){

    this.movieService.moviesCartelera = [];
    this.movieService.getMovieByName(name).subscribe({
      next: (data) => { this.movieService.movies = data },
      error: (e) => { console.log(e) }
    })
    this.nombreInput = ''
    this.idInput = ""
    this.mostrarAgregar = false;
    
  }

  manejarEnvio(id:string){
    this.movieService.postMovie(id).subscribe({
      next: (data) => {console.log(data);
      this.getAllMovies();},
      error:(e)=>{console.log(e)}
    })
    this.nombreInput = ''
    this.idInput = ""
    this.mostrarAgregar = false;
  
  }

  getAllMovies(){
    this.movieService.movies = [];
    this.movieService.getMovies().subscribe({
      next: (data) => {this.movieService.moviesCartelera = data},
      error: (e) => {console.log(e)}
    })

    this.nombreInput = ''
    this.idInput = ""
    this.selectedMovie = undefined;
    this.mostrarAgregar = false;
  }

  esArray(valor: any): boolean {
    return Array.isArray(valor);
  }


  eliminarDeCartelera(id : string){
    this.movieService.deleteMovie(id).subscribe({
      next: () => {
        this.getAllMovies();
      },
      error: (e) => console.log(e)
  })
}
  

  ngOnInit(): void {
    this.getAllMovies();
  }

}
