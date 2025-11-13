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


<<<<<<< Updated upstream
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
  
=======
/* método DELETE con validación de funciones */
  async eliminarDeCartelera(id: number, titulo: string) {
    if (!id) return;

    // 1) Consultar si la película está usada en alguna función
    this.funcionService.getDisponiblesPorPelicula(id).subscribe({
      next: async (funciones) => {
        if (funciones && funciones.length > 0) {
          this.toastr.error('No podés eliminar esta película porque está asignada a una función.');
          return;
        }

        // 2) Si NO tiene funciones, pedimos confirmación
        const result = await Swal.fire({
          title: 'Confirmar eliminación',
          html: `¿Eliminar la película <b>"${titulo}"</b> de la cartelera?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Eliminar',
          cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) {
          this.toastr.error('Eliminación cancelada por el usuario.');
          return;
        }

        // 3) Si confirmó, eliminamos
        this.movieService.deleteMovie(id.toString()).subscribe({
          next: () => {
            this.toastr.success('Película eliminada correctamente.');

            // Si justo la estabas viendo en el panel derecho, lo limpiamos
            if (this.selectedMovie && this.selectedMovie.id === id) {
              this.selectedMovie = undefined;
              this.mostrarAgregar = false;
              this.editMode = false;
            }

            this.getAllMovies();
          },
          error: (error: HttpErrorResponse) => {
            this.errorHandlerService.handleHttpError(error);
          }
        });
      },
      error: (error: HttpErrorResponse) => {
        this.errorHandlerService.handleHttpError(error);
      }
    });
  }
>>>>>>> Stashed changes

  ngOnInit(): void {
    this.getAllMovies();
  }
}
