import { Component } from '@angular/core';
import {  FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/AuthService/auth-service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  tipoDeCampo : boolean = false;

  readonly ruta_ojo_cerrado = "img/password/eye-closed.svg";
  readonly ruta_ojo_abierto = "img/password/eye-open-svgrepo-com.svg";

  
  formLogin: FormGroup;
  User: FormControl;
  Password: FormControl;


  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) {
    this.User = new FormControl('', Validators.required);
    this.Password = new FormControl('', Validators.required);

    this.formLogin = new FormGroup({
      User : this.User,
      Password : this.Password
    })
  }

  onSubmit(): void {

    if (this.formLogin.invalid) {
      this.toastr.error('Por favor, introduzca usuario y contraseña válidos.');
    }

    this.authService.login(this.formLogin.value.User, this.formLogin.value.Password).subscribe({
      next: () => {
        this.toastr.success("¡Login exitoso!");
        this.router.navigate(['/']);
      },
      error: () => {
        this.toastr.error('Error de autenticación. Verifica tus credenciales.');
      }
    });
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

