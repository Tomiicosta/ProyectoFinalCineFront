import { Component } from '@angular/core';
import { CinemaService } from '../../services/cinema/cinema-service';
import { AuthService } from '../../services/AuthService/auth-service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Sala } from '../../models/sala';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ErrorHandler } from '../../services/ErrorHandler/error-handler';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-salas',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './admin-salas.html',
  styleUrl: './admin-salas.css',
})

export class AdminSalas {

  filtroHabilitadas: boolean = true;
  salaForm!: FormGroup;
  vistaActual: 'habilitadas' | 'inhabilitadas' = 'habilitadas';
  isEditing = false;
  selectedSala: any | null = null;
  detalleSala: Sala | null = null;

  constructor(private fb: FormBuilder,public cinemaService: CinemaService, public authService: AuthService, private toastr: ToastrService, private errorHandlerService: ErrorHandler) {}

  /* Formulario agregar */
  crearFormulario() {
    this.salaForm = this.fb.group({
      name: ['', Validators.required],
      screenType: ['', Validators.required],
      atmos: [false],
      rowSeat: [0, [Validators.required, Validators.min(1)]],
      columnSeat: [0, [Validators.required, Validators.min(1)]],
      enabled: [true]
    });
  }

  verDetalleSala(sala: Sala) {
    this.isEditing = false;        // aseguramos que no esté el form de edición
    this.detalleSala = sala;       // mostramos la vista de detalle
  }

  cerrarDetalle() {
    this.detalleSala = null;
  }

  getScreenTypeLabel(type: string): string {
    switch (type) {
      case 'STANDARD': return '2D';
      case 'THREE_D':  return '3D';
      case 'FOUR_D':   return '4D';
      case 'IMAX':     return 'IMAX';
      default:         return type ?? '';
    }
  }

  /* metodo post */
  agregarSala() {
    if (this.salaForm.valid) {
      const nuevaSala = this.salaForm.value;

      console.log('Nueva sala:', nuevaSala);

      this.cinemaService.postSala(nuevaSala).subscribe({
        next: () => {
          this.toastr.success("Sala agregada correctamente.");
          this.salaForm.reset({
            name: '',
            screenType: '',
            atmos: false,
            rowSeat: 0,
            columnSeat: 0,
            enabled: true
          });

          if (this.vistaActual === 'habilitadas') {
            this.getSalasHabilitadas();
          } else {
            this.getSalasInhabilitadas();
          }
        },
        error: (error: HttpErrorResponse) => {
          this.errorHandlerService.handleHttpError(error);
        }
      });
    } else {
      console.warn('Formulario inválido');
      this.salaForm.markAllAsTouched();
    }
  }

  /* rellena el formulario con los datos de la pelicula seleccionada*/
  editarSala(sala: any) {
    this.isEditing = true;
    this.detalleSala = null;
    this.selectedSala = sala;

    console.log(sala)

    this.salaForm.patchValue({
      id: sala.id,
      name: sala.name,
      screenType: sala.screenType,
      atmos: !!sala.atmos,
      rowSeat: sala.rowSeat,
      columnSeat: sala.columnSeat,
      enabled: sala.enabled
    });
  }

  /*Metodo put */
  actualizarSala() {
    if (!this.isEditing || !this.selectedSala) return;

    if (this.salaForm.valid) {
      const payload = this.salaForm.value;
      const id = this.selectedSala.id ?? payload.id;

      if (!id) {
        console.error('No se encontró ID de sala para actualizar');
        return;
      }

      this.cinemaService.putSala(id, payload).subscribe({
        next: () => {
          this.toastr.success('Sala actualizada correctamente');
          this.resetFormYRefrescar();
        },
        error: (error: HttpErrorResponse) => {
          this.errorHandlerService.handleHttpError(error);
        }
      });
    } else {
      this.salaForm.markAllAsTouched();
    }
  }

    /* resetea el formulario y resetea campos */
    cancelarEdicion() {
      this.isEditing = false;
      this.selectedSala = null;
      this.salaForm.reset({
        id: null,
        name: '',
        screenType: '',
        atmos: false,
        rowSeat: 0,
        columnSeat: 0,
        enabled: true
      });
    }

      /* metodo DELETE */
    async eliminarSala(sala: any) {
      const id = sala?.id;
      if (!id) return;

      const result = await Swal.fire({
              title: 'Confirmar Eliminación',
              html: `¿Eliminar la sala "${sala.name}"?`,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#d33', 
              cancelButtonColor: '#3085d6',
              confirmButtonText: 'Eliminar',
              cancelButtonText: 'Cancelar'
            });
        
            //Verificar el resultado de la confirmación
            if (!result.isConfirmed) {
              this.toastr.error('Eliminación cancelada por el usuario.');
              return; 
            }


        this.cinemaService.deleteSala(id).subscribe({
          next: () => {
            this.toastr.success('Sala eliminada correctamente');
            // Si estabas editando esa misma sala, cancelá edición
            if (this.selectedSala?.id === sala.id) {
              this.cancelarEdicion();
            }
            this.refrescarListadoActual();
          },
          error: (error: HttpErrorResponse) => {
            this.errorHandlerService.handleHttpError(error);
          }
        });
      }

  /* cambia el listado de salas cada vez que tocan el checkbox*/
  actualizarFiltroHabilitadas() {
    if (this.filtroHabilitadas) {
      this.getSalasHabilitadas();
    } else {
      this.getSalasInhabilitadas();
    }
  }

  /*trae salas habilitadas */
  getSalasHabilitadas(){
    this.vistaActual = 'habilitadas';
    this.cinemaService.getSalasByEnabled(true).subscribe({
      next: (data) => { this.cinemaService.salas = data; },
      error: (error: HttpErrorResponse) => {
        this.errorHandlerService.handleHttpError(error);   
      }
    });
  }

    /*trae salas inhabilitadas */
  getSalasInhabilitadas(){
    this.vistaActual = 'inhabilitadas';
    this.cinemaService.getSalasByEnabled(false).subscribe({
      next: (data) => { this.cinemaService.salas = data; },
      error: (error: HttpErrorResponse) => {
        this.errorHandlerService.handleHttpError(error);  
      }
    });
  }

  /* refresca el listado que se estaba mostrando */
  private refrescarListadoActual() {
    if (this.vistaActual === 'habilitadas') {
      this.getSalasHabilitadas();
    } else {
      this.getSalasInhabilitadas();
    }
  }

  private resetFormYRefrescar() {
    this.cancelarEdicion(); // resetea form y flags
    this.refrescarListadoActual();
  }

  ngOnInit(): void {
    this.getSalasHabilitadas();
    this.crearFormulario();
  }

}
