import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import Movie from '../../models/movie';
import { MovieService } from '../../services/movie/movie-service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/AuthService/auth-service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ErrorHandler } from '../../services/ErrorHandler/error-handler';

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

  constructor(public movieService: MovieService, public authService: AuthService, private toastr: ToastrService, private errorHandlerService: ErrorHandler) {}


  seleccionar(id: string) {
    this.getMovieById(id);
    this.mostrarAgregar = true;
  }

  seleccionarBD(id:string){
    this.movieService.getMovieBd(id).subscribe({
      next: (data) => { this.selectedMovie = data;
        this.mostrarAgregar = true;
      },
      error: (error: HttpErrorResponse) => {
        this.errorHandlerService.handleHttpError(error);  
      }
    })
  }

  getMovieById(id:string){
    this.movieService.getMovie(id).subscribe({
      next: (data) => { this.selectedMovie = data;},
      error: (error: HttpErrorResponse) => {
        this.errorHandlerService.handleHttpError(error);
      }
    })
  }


  getMoviesByName(name:string){

    this.movieService.moviesCartelera = [];
    this.movieService.getMovieByName(name).subscribe({
      next: (data) => { this.movieService.movies = data },
      error: (error: HttpErrorResponse) => {
        this.errorHandlerService.handleHttpError(error);
      }
    })
    this.nombreInput = ''
    this.idInput = ""
    this.mostrarAgregar = false;
    
  }

  manejarEnvio(id:string){
    this.movieService.postMovie(id).subscribe({
      next: (data) => {
        console.log(data);
        this.toastr.success("Película agregada correctamente a la cartelera.");
      this.getAllMovies();},
      error: (error: HttpErrorResponse) => {
        this.errorHandlerService.handleHttpError(error);
      }
    })
    this.nombreInput = ''
    this.idInput = ""
    this.mostrarAgregar = false;
  
  }

  getAllMovies(){
    this.movieService.movies = [];
    this.movieService.getMovies().subscribe({
      next: (data) => {this.movieService.moviesCartelera = data},
      error: (error: HttpErrorResponse) => {
        this.errorHandlerService.handleHttpError(error);
      }
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
        this.toastr.success("Película eliminada correctamente.");

      },
      error: (error: HttpErrorResponse) => {
        this.errorHandlerService.handleHttpError(error);  
      }
  })
}
  

  ngOnInit(): void {
    this.getAllMovies();
  }

}
