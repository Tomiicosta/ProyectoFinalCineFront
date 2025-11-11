import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import Movie from '../../models/movie';
import { MovieService } from '../../services/movie/movie-service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/AuthService/auth-service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

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

  constructor(public movieService: MovieService, public authService: AuthService, private toastr: ToastrService) {}


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
      
        //Verifica si es un error 400 del tipo esperado
          if (error.status === 400 && error.error) {
            let errorMessage: string;

            if (typeof error.error === 'string') {
              errorMessage = error.error; 
            } else if (error.error.message) {
              errorMessage = error.error.message;
            } else {
              errorMessage = 'Ocurrió un error de validación en el servidor.';
            }

            // Muestra el error como una notificación
            this.toastr.error(errorMessage, 'Error:');
        
          }
        }
    })
  }

  getMovieById(id:string){
    this.movieService.getMovie(id).subscribe({
      next: (data) => { this.selectedMovie = data;},
      error: (error: HttpErrorResponse) => {
      
        //Verifica si es un error 400 del tipo esperado
          if (error.status === 400 && error.error) {
            let errorMessage: string;

            if (typeof error.error === 'string') {
              errorMessage = error.error; 
            } else if (error.error.message) {
              errorMessage = error.error.message;
            } else {
              errorMessage = 'Ocurrió un error de validación en el servidor.';
            }

            // Muestra el error como una notificación
            this.toastr.error(errorMessage, 'Error:');
        
          }
        }
    })
  }


  getMoviesByName(name:string){

    this.movieService.moviesCartelera = [];
    this.movieService.getMovieByName(name).subscribe({
      next: (data) => { this.movieService.movies = data },
      error: (error: HttpErrorResponse) => {
      
        //Verifica si es un error 400 del tipo esperado
          if (error.status === 400 && error.error) {
            let errorMessage: string;

            if (typeof error.error === 'string') {
              errorMessage = error.error; 
            } else if (error.error.message) {
              errorMessage = error.error.message;
            } else {
              errorMessage = 'Ocurrió un error de validación en el servidor.';
            }

            // Muestra el error como una notificación
            this.toastr.error(errorMessage, 'Error:');
        
          }
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
      
        //Verifica si es un error 400 del tipo esperado
          if (error.status === 400 && error.error) {
            let errorMessage: string;

            if (typeof error.error === 'string') {
              errorMessage = error.error; 
            } else if (error.error.message) {
              errorMessage = error.error.message;
            } else {
              errorMessage = 'Ocurrió un error de validación en el servidor.';
            }

            // Muestra el error como una notificación
            this.toastr.error(errorMessage, 'Error:');
        
          }
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
      
        //Verifica si es un error 400 del tipo esperado
          if (error.status === 400 && error.error) {
            let errorMessage: string;

            if (typeof error.error === 'string') {
              errorMessage = error.error; 
            } else if (error.error.message) {
              errorMessage = error.error.message;
            } else {
              errorMessage = 'Ocurrió un error de validación en el servidor.';
            }

            // Muestra el error como una notificación
            this.toastr.error(errorMessage, 'Error:');
        
          }
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
      
        //Verifica si es un error 400 del tipo esperado
          if (error.status === 400 && error.error) {
            let errorMessage: string;

            if (typeof error.error === 'string') {
              errorMessage = error.error; 
            } else if (error.error.message) {
              errorMessage = error.error.message;
            } else {
              errorMessage = 'Ocurrió un error de validación en el servidor.';
            }

            // Muestra el error como una notificación
            this.toastr.error(errorMessage, 'Error:');
        
          }
        }
  })
}
  

  ngOnInit(): void {
    this.getAllMovies();
  }

}
