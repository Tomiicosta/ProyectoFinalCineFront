import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/AuthService/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  
  formLogin: FormGroup;


  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.formLogin = this.fb.group({
      User: [''],
      Password: ['']
    });
  }

  onSubmit(): void {

    if (this.formLogin.invalid) {
      alert('Por favor, introduce usuario y contraseña válidos.');
    }

    this.authService.login(this.formLogin.value.User, this.formLogin.value.Password).subscribe({
      next: () => {
        alert('Log in exitoso.')
        this.router.navigate(['/']);
      },
      error: (err) => {
        alert('Error de autenticación. Verifica tus credenciales.');
      }
    });
  }
}

