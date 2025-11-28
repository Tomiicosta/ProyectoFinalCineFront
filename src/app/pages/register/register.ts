import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/AuthService/auth-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Registro } from '../../models/registro';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ErrorHandler } from '../../services/ErrorHandler/error-handler';
import { UserService } from '../../services/user/user';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {

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

  returnUrl: string | undefined;

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService, private errorHandlerService:ErrorHandler, private route: ActivatedRoute, private userService: UserService){
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

  ngOnInit(): void {

    //  Verificar sesión
    // Intentar obtener usuario
    this.userService.getMyProfile().subscribe({
      next: (user) => {
        // Si está logueado
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error(err);
      }
    });

    // Recibe el comando previo si ya viene de un step 3 (comprar ticket)
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
  }

  onSubmit(): void {

    if (this.formRegister.valid) {
      
      const userData: Registro = this.formRegister.value;

      this.authService.register(userData).subscribe({
        next: (response) => {

          this.toastr.success("¡Ya estas registrado!");

          if (this.returnUrl) {
            // Construye URL a donde debe volver
            this.router.navigate(['/login'], {
              queryParams: { returnUrl: '/ticket/step4' }
            });
          } else {
            this.router.navigate(['/login']);
          }

        },
        error: (error: HttpErrorResponse) => {
          this.errorHandlerService.handleHttpError(error);
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

