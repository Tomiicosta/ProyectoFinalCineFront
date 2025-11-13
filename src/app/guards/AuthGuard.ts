// src/app/core/guards/auth.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/AuthService/auth-service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router) {}
  
  //Metodo para proteger rutas que se necesita estar loggeado
  canActivate(): Observable<boolean> {
    // Usamos el Observable del servicio para la comprobación
    return this.authService.isLoggedIn$.pipe(
      take(1), // Toma el valor actual y completa
      map(isLoggedIn => {
        if (isLoggedIn) {
          return true; // Acceso permitido
        } else {
          // Si no está logueado, redirige a la página de login
          this.router.navigate(['/login']);
          return false; // Acceso denegado
        }
      })
    );
  }
}