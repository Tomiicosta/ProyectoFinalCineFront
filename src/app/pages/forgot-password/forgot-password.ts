import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/AuthService/auth-service';
import { ErrorHandler } from '../../services/ErrorHandler/error-handler';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {

  enviado: boolean = false;
  cargando: boolean = false;

  Email: FormControl;
  formForgotPassword: FormGroup;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private errorHandlerService: ErrorHandler
  ) {
    this.Email = new FormControl('', [Validators.required, Validators.email]);

    this.formForgotPassword = new FormGroup({
      Email: this.Email
    });
  }

  onSubmit(): void {
    if (this.formForgotPassword.invalid) {
      this.formForgotPassword.markAllAsTouched();
      return;
    }

    this.cargando = true;

    this.authService.forgotPassword(this.Email.value).subscribe({
      next: () => {
        this.cargando = false;
        this.enviado = true;
      },
      error: (error: HttpErrorResponse) => {
        this.cargando = false;
        this.errorHandlerService.handleHttpError(error);
      }
    });
  }
}
