import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/AuthService/auth-service';
import { Router } from '@angular/router';
import { Registro } from '../../models/registro';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  formRegister: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router){
    this.formRegister = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      surname: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  onSubmit(): void {
    
    if (this.formRegister.valid) {
      
      const userData: Registro = this.formRegister.value;

      this.authService.register(userData).subscribe({
        next: (response) => {
          console.log('Registro exitoso:', response);
          alert('¡Ya estas registrado!');

          this.router.navigate(['/login']);
          
        },
        error: (err) => {
          console.error('Error en el registro:', err);
          alert("Error al registrarse.");
        }
      });
    } else {
      this.formRegister.markAllAsTouched();
    }
  }

}
