import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/AuthService/auth-service';
import { Router } from '@angular/router';
import { Registro } from '../../models/registro';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  tipoDeCampo : boolean = false;

  readonly ruta_ojo_cerrado = "img/password/eye-closed.svg";
  readonly ruta_ojo_abierto = "img/password/eye-open-svgrepo-com.svg";

  readonly passwordRegex: RegExp = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])(?=.{6,})/;

  formRegister: FormGroup;
  name: FormControl;
  surname: FormControl;
  username: FormControl;
  email: FormControl;
  password: FormControl;


  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService){
    this.name = new FormControl ('', [Validators.required, Validators.minLength(3)]),
    this.surname = new FormControl ('', [Validators.required, Validators.minLength(3)]),
    this.username = new FormControl ('', [Validators.required, Validators.minLength(3)]),
    this.email = new FormControl ('', [Validators.required, Validators.email]),
    this.password = new FormControl ('', [Validators.required, Validators.minLength(6), Validators.pattern(this.passwordRegex)])

    this.formRegister = new FormGroup({
      name : this.name,
      surname : this.surname,
      username : this.username,
      email : this.email,
      password : this.password
    })
  }

  onSubmit(): void {
    
    if (this.formRegister.valid) {
      
      const userData: Registro = this.formRegister.value;

      this.authService.register(userData).subscribe({
        next: (response) => {
          console.log('Registro exitoso:', response);
          this.toastr.success("¡Ya estas registrado!");

          this.router.navigate(['/login']);
          
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

        // Muestra el error como un alert
          this.toastr.error(errorMessage, 'Error de registro');
        
          }
        }
      });
    } else {
      this.formRegister.markAllAsTouched();
    }
  }

  verContrasenia(): void{
    this.tipoDeCampo = !this.tipoDeCampo;
  }

  public obtenerIcono(): string {
    return this.tipoDeCampo 
      ? this.ruta_ojo_abierto
      : this.ruta_ojo_cerrado;
  }
}

