import { Component } from '@angular/core';
import { SalaService } from '../../services/salas-service';
import { AuthService } from '../../services/AuthService/auth-service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

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

  constructor(private fb: FormBuilder,public salasService: SalaService, public authService: AuthService) {}

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

  /* metodo post */
  agregarSala() {
    if (this.salaForm.valid) {
      const nuevaSala = this.salaForm.value;

      console.log('Nueva sala:', nuevaSala);

      this.salasService.postSala(nuevaSala).subscribe({
        next: () => {
          console.log('Sala agregada correctamente');
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
        error: (e) => console.error(e)
      });
    } else {
      console.warn('Formulario inválido');
      this.salaForm.markAllAsTouched();
    }
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
    this.salasService.salas = [];
    this.salasService.getSalasByEnabled(true).subscribe({
      next: (data) => { this.salasService.salas = data; },
      error: (e) => console.log(e)
    });
  }

    /*trae salas inhabilitadas */
  getSalasInhabilitadas(){
    this.vistaActual = 'inhabilitadas';
    this.salasService.salas = [];
    this.salasService.getSalasByEnabled(false).subscribe({
      next: (data) => { this.salasService.salas = data; },
      error: (e) => console.log(e)
    });
  }

  ngOnInit(): void {
    this.getSalasHabilitadas();
    this.crearFormulario();
  }

}
