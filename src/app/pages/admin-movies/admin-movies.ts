import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import Movie from '../../models/movie';
import { MovieService } from '../../services/movie/movie-service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/AuthService/auth-service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ErrorHandler } from '../../services/ErrorHandler/error-handler';
import { DecimalPipe } from '@angular/common';
import Swal from 'sweetalert2';
import { FunctionService } from '../../services/function/function-service';
import { AbstractControl } from '@angular/forms';
import { ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-admin-movies',
  imports: [FormsModule, DecimalPipe, ReactiveFormsModule],
  templateUrl: './admin-movies.html',
  styleUrl: './admin-movies.css',
})
export class AdminMovies implements OnInit{

  idInput: string = '';
  nombreInput: string = '';
  selectedMovie?: Movie; 
  mostrarAgregar : boolean = false;
  editMode: boolean = false;
  movieForm!: FormGroup;   
  movieIsFromDb: boolean = false;

  constructor(public movieService: MovieService, public authService: AuthService, private toastr: ToastrService, private errorHandlerService: ErrorHandler,private fb: FormBuilder, public funcionService : FunctionService     ) {}

   // ========================
  // FORM INIT / PATCH
  // ========================

  espacioVacio(abs:AbstractControl): ValidationErrors | null{
    const value = abs.value || ""
    if(value.trim().length===0){
      return {vacio:true}
    }
    return null;
  }

  private buildForm(): void {
    this.movieForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100), this.espacioVacio]],
      adult: [false],
      posterUrl: [''],
      bannerUrl: [''], 
      genres: [Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñÑ ,]+$/)],   
      overview: ['', Validators.maxLength(2000)],
    });
  }

  private patchForm(movie: Movie): void {
    this.movieForm.patchValue({
      title: movie.title,
      adult: movie.adult,
      runtime: movie.runtime,
      posterUrl: (movie as any).posterUrl || '',
      bannerUrl: (movie as any).bannerUrl || '',
      genres: movie.genres ? movie.genres.join(', ') : '',
      overview: movie.overview,
    });
  }

  

  toggleEditar(): void {
    this.editMode = !this.editMode;

    if (this.editMode && this.selectedMovie) {
      if (!this.movieForm) {
        this.buildForm();
      }
      this.patchForm(this.selectedMovie);
    }
  }

  onSubmitEdit(): void {
    if (!this.selectedMovie || this.movieForm.invalid) {
      return;
    }

    const formValue = this.movieForm.value;

    // Transformar géneros string -> array
    const genresArray = formValue.genres
      ? (formValue.genres as string)
          .split(',')
          .map(g => g.trim())
          .filter(g => g.length > 0)
      : [];

    const updatedMovie: any = {
      ...this.selectedMovie,
      title: formValue.title,
      adult: formValue.adult,
      overview: formValue.overview,
      genres: genresArray,
      posterUrl: formValue.posterUrl,
      bannerUrl: formValue.bannerUrl
    };

    this.movieService.updateMovie(this.selectedMovie.id.toString(), updatedMovie).subscribe({
      next: (data) => {
        this.toastr.success('Película actualizada correctamente.');
        this.selectedMovie = data;     // refrescamos detalles
        this.patchForm(this.selectedMovie);
        this.editMode = false;
        this.getAllMovies();
      },
      error: (error: HttpErrorResponse) => {
        this.errorHandlerService.handleHttpError(error);
      }
    });
  }

  seleccionar(id: string) {
    this.getMovieById(id);
    this.mostrarAgregar = true;
    this.editMode = false;
    this.movieIsFromDb = false; 
  }

  seleccionarBD(id: string) {
    this.movieService.getMovieBd(id).subscribe({
      next: (data) => {
        this.selectedMovie = data;
        this.mostrarAgregar = true;
        this.editMode = false;
        this.movieIsFromDb = true; 
        if (!this.movieForm) {
          this.buildForm();
        }
        this.patchForm(this.selectedMovie!);
      },
      error: (error: HttpErrorResponse) => {
        this.errorHandlerService.handleHttpError(error);
      }
    });
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



  

  ngOnInit(): void {
    this.buildForm();
    this.getAllMovies();
    
  }

}