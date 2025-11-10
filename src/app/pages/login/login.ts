import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/AuthService/auth-service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  
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
        this.toastr.success("¡Login exitoso!")
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.toastr.error('Error de autenticación. Verifica tus credenciales.');
      }
    });
  }
}

