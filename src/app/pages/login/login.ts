import { Component, OnInit } from '@angular/core';
import {  FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/AuthService/auth-service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user/user';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {

  tipoDeCampo : boolean = false;

  readonly ruta_ojo_cerrado = "img/password/eye-closed.svg";
  readonly ruta_ojo_abierto = "img/password/eye-open-svgrepo-com.svg";

  
  formLogin: FormGroup;
  User: FormControl;
  Password: FormControl;

  returnUrl: string | undefined;

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService, private route: ActivatedRoute, private userService: UserService) {
    this.User = new FormControl('', Validators.required);
    this.Password = new FormControl('', Validators.required);

    this.formLogin = new FormGroup({
      User : this.User,
      Password : this.Password
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

    if (this.formLogin.invalid) {
      this.toastr.error('Por favor, introduzca usuario y contraseña válidos.');
    }

    this.authService.login(this.formLogin.value.User, this.formLogin.value.Password).subscribe({
      next: () => {

        this.toastr.success("¡Login exitoso!");

        if (this.returnUrl) {
          // Redirige a donde venía originalmente el usuario (PASO 3)
          this.router.navigateByUrl(this.returnUrl);
        } else {
          this.router.navigate(['/']);
        }
        
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

