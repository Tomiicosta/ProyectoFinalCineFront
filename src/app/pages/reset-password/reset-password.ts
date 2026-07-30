import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/AuthService/auth-service';
import { ErrorHandler } from '../../services/ErrorHandler/error-handler';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword implements OnInit {

  tipoDeCampo: boolean = false;
  tipoDeCampoConfirm: boolean = false;

  readonly ruta_ojo_cerrado = "img/password/eye-closed.svg";
  readonly ruta_ojo_abierto = "img/password/eye-open-svgrepo-com.svg";

  readonly passwordRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\[\]{}|;:'",.<>?/\\`~])[A-Za-z\d!@#$%^&*()\-_=+\[\]{}|;:'",.<>?/\\`~]{6,20}$/; // referencia password OWASP

  token: string | null = null;

  password: FormControl;
  confirmPassword: FormControl;
  formResetPassword: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private errorHandlerService: ErrorHandler
  ) {
    this.password = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20), Validators.pattern(this.passwordRegex)]);
    this.confirmPassword = new FormControl('', [Validators.required]);

    this.formResetPassword = new FormGroup({
      password: this.password,
      confirmPassword: this.confirmPassword
    },
      { validators: this.passwordMatchValidator() }
    );
  }

  private passwordMatchValidator() {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get('password')?.value;
      const confirmPassword = formGroup.get('confirmPassword')?.value;
      return password === confirmPassword ? null : { mismatch: true };
    };
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');

    if (!this.token) {
      this.toastr.error('El enlace de recuperación no es válido.');
      this.router.navigate(['/forgot-password']);
    }
  }

  onSubmit(): void {
    if (this.formResetPassword.invalid || !this.token) {
      this.formResetPassword.markAllAsTouched();
      return;
    }

    this.authService.resetPassword(this.token, this.password.value).subscribe({
      next: () => {
        this.toastr.success('¡Contraseña actualizada con éxito!');
        this.router.navigate(['/login']);
      },
      error: (error: HttpErrorResponse) => {
        this.errorHandlerService.handleHttpError(error);
      }
    });
  }

  verContrasenia(): void {
    this.tipoDeCampo = !this.tipoDeCampo;
  }

  verContraseniaConfirm(): void {
    this.tipoDeCampoConfirm = !this.tipoDeCampoConfirm;
  }

  public obtenerIcono(): string {
    return this.tipoDeCampo
      ? this.ruta_ojo_abierto
      : this.ruta_ojo_cerrado;
  }

  public obtenerIconoConfirm(): string {
    return this.tipoDeCampoConfirm
      ? this.ruta_ojo_abierto
      : this.ruta_ojo_cerrado;
  }
}
