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
import { FunctionService } from '../../services/function/function-service';
import { firstValueFrom } from 'rxjs';

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

  constructor(private fb: FormBuilder,public cinemaService: CinemaService, public authService: AuthService, private toastr: ToastrService, private errorHandlerService: ErrorHandler, public funcionService : FunctionService) {}

  /* Formulario agregar */
  crearFormulario() {
    this.salaForm = this.fb.group({
      name: ['', Validators.required],
      screenType: ['', Validators.required],
      atmos: [false],
      rowSeat: [0, [Validators.required, Validators.min(1)]],
      columnSeat: [0, [Validators.required, Validators.min(1)]],
      enabled: [true],
      price:[0, [Validators.required, Validators.min(1)]]
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
            enabled: true,
            price: 0
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
      this.toastr.error("Formulario invalido: Completes los campos")
      this.salaForm.markAllAsTouched();
    }
  }

 

/* rellena el formulario con los datos de la sala seleccionada */
async editarSala(sala: any) {
  if (!sala?.id) return;

  try {
    // 1) Consultar funciones de esa sala
    const funciones = await firstValueFrom(this.funcionService.getPorSala(sala.id));

    // 2) Si tiene funciones, NO permitimos editar
    if (funciones && funciones.length > 0) {
      this.toastr.error('No podés modificar esta sala porque está asignada a una función.');
      return;
    }
  } catch (error) {
    // Si hay un error real, lo manejás con tu handler
    this.errorHandlerService.handleHttpError(error as HttpErrorResponse);
    return;
  }

  // 3) Si no tiene funciones → habilitás la edición normalmente
  this.isEditing = true;
  this.detalleSala = null;
  this.selectedSala = sala;

  this.salaForm.patchValue({
    id: sala.id,
    name: sala.name,
    screenType: sala.screenType,
    atmos: !!sala.atmos,
    rowSeat: sala.rowSeat,
    columnSeat: sala.columnSeat,
    enabled: sala.enabled,
    price: sala.price
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
        enabled: true,
        price: 0
      });
    }

    private async confirmarEliminacionSala(nombreSala: string): Promise<boolean> {
      const result = await Swal.fire({
        title: 'Confirmar Eliminación',
        html: `¿Eliminar la sala "<b>${nombreSala}</b>"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
      });
    
      return result.isConfirmed;
    }
    

    /* método DELETE */
async eliminarSala(sala: any) {
  const id = sala?.id;
  if (!id) return;

  this.funcionService.getPorSala(id).subscribe({
    next: async (funciones) => {
      // 1) Verifico si la sala está asociada a alguna función
      if (funciones && funciones.length > 0) {
        this.toastr.error("No podés eliminar esta sala porque está asignada a una función.");
        return;
      }

      // 2) Si no está usada, pido confirmación
      const result = await this.confirmarEliminacionSala(sala.name);

      if (!result) {
        this.toastr.error('Eliminación cancelada por el usuario.');
        return;
      }

      // 3) Si confirmó, elimino
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

