import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { Funcion } from '../../models/funcion';
import Movie from '../../models/movie';
import { Sala } from '../../models/sala';

import { MovieService } from '../../services/movie/movie-service';
import { SalaService } from '../../services/salas-service';
import { FunctionService } from '../../services/function/function-service';

import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-funciones',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './admin-funciones.html',
  styleUrl: './admin-funciones.css',
})
export class AdminFunciones {
  // Listado
  funcionesFiltradas: Funcion[] = [];

  // Filtros
  filtroPelicula: string = '';
  filtroSala: string = '';
  filtroFecha: string = '';   // yyyy-MM-dd
  filtroHorario: string = ''; // (no se usa en el filtro, lo dejo para que el HTML no rompa)

  // Catálogos
  peliculas: Movie[] = [];
  salas: Sala[] = [];

  // Form (sólo crear)
  funcionForm!: FormGroup;

  // Detalle
  selectedFuncion: Funcion | null = null;
  detalleFuncion: Funcion | null = null;

  

  constructor(
    private fb: FormBuilder,
    public funcionService: FunctionService,
    public salaService: SalaService,
    public movieService: MovieService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.crearFormulario();
    this.cargarCatalogos();
    this.cargarFunciones();
  }

  // ---------- FORM ----------
  private crearFormulario() {
    this.funcionForm = this.fb.group({
      date: ['', Validators.required],   // yyyy-MM-dd
      time: ['', Validators.required],   // HH:mm
      movieId: [null, Validators.required],
      salaId: [null, Validators.required],
    });
  }

  // ---------- DATA ----------
  private cargarCatalogos() {
    // Películas
    this.movieService.getMovies().subscribe({
      next: (data: Movie[]) => { this.peliculas = data; },
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
    });

    // Salas (solo habilitadas)
    this.salaService.getSalasByEnabled(true).subscribe({
      next: (data: Sala[]) => { this.salas = data; },
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
    });
  }

  private cargarFunciones() {
    this.funcionService.getFunciones().subscribe({
      next: (data: Funcion[]) => {
        this.funcionService.funciones = data || [];
        this.funcionesFiltradas = [...this.funcionService.funciones];
        
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
    });
  }

  // ---------- DETALLE ----------
  verDetalleFuncion(f: Funcion) {
    this.selectedFuncion = null;
    this.detalleFuncion = f;
    console.log(f)
    
  }

  cerrarDetalle() {
    this.detalleFuncion = null;
  }

  // ---------- FILTROS ----------
  aplicarFiltros() {
    const lista = this.funcionService.funciones || [];
    this.funcionesFiltradas = lista.filter(f => {
      const okMovie = this.filtroPelicula ? f.movieId === Number(this.filtroPelicula) : true;
      const okSala  = this.filtroSala ? f.cinemaId === Number(this.filtroSala) : true;

      
      let okFecha = true;
      if (this.filtroFecha) okFecha = (f.date ?? '').startsWith(this.filtroFecha);

      return okMovie && okSala && okFecha;
    });
  }

  limpiarFiltros() {
    this.filtroPelicula = '';
    this.filtroSala = '';
    this.filtroFecha = '';
    this.funcionesFiltradas = [...(this.funcionService.funciones || [])];
  }

  // ---------- ALTA ----------
  agregarFuncion() {
    if (this.funcionForm.invalid) {
      this.funcionForm.markAllAsTouched();
      return;
    }

    const payload = this.armarPayload(this.funcionForm.value);

    this.funcionService.postFuncion(payload).subscribe({
      next: (data) => {   
        this.resetForm();
        this.cargarFunciones();
        this.toastr.success("Función agregada correctamente.");
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
    });
  }

 // ---------- ELIMINAR ----------
 eliminarFuncion(f: Funcion) {
  if (!confirm(`¿Eliminar la función de "${f.movieName}" en sala "${f.cinemaName}"?`)) return;
  this.funcionService.deleteFuncion(f.id).subscribe({
    next: () => {
      this.cargarFunciones();
      this.toastr.success("Función eliminada correctamente.");
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
  });
}

  // ---------- HELPERS ----------
  private armarPayload(formValue: any) {
    const { date, time, movieId, salaId } = formValue;
    const showtime = this.toLocalDateTimeString(date, time); // "YYYY-MM-DDTHH:mm:00"
    return {
      showtime,
      movieId: Number(movieId),
      cinemaId: Number(salaId)
    };
  }

  private toLocalDateTimeString(date: string, time: string): string {
    const d = (date || '').trim();        // yyyy-MM-dd
    const hhmm = (time || '').slice(0, 5); // HH:mm
    return `${d}T${hhmm}:00`;
  }

  private resetForm() {
    this.selectedFuncion = null;
    this.detalleFuncion = null;
    this.funcionForm.reset();
  }
}
