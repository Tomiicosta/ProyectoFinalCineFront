import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/AuthService/auth-service';
import { catchError,throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

  

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService); // Asumiendo que existe
  const toastr = inject(ToastrService);
  
  const token = localStorage.getItem('token');
  let requestWithToken = req;
 
  if (token) {
    requestWithToken = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    //Lógica para manejar la respuesta
    //Se usa pipe y catchError para inspeccionar la respuesta del backend
    return next(requestWithToken).pipe(
      catchError((error: HttpErrorResponse) => {
      
        //Revisa si el error es 401 (Unauthorized/Token Caducado) o 403 (Forbidden)
        if (error.status === 401 || error.status === 403) {
          console.error('Error de Autenticación: Token inválido o caducado. Redirigiendo a Login.');
          toastr.error('Error de Autenticación: Token inválido o caducado. Redirigiendo a Login.');
        
          //Limpia la sesión (tokens) y datos de usuario
          authService.logout(); 
          localStorage.removeItem('token'); 
        
          //Redirige al usuario a la página de login
          router.navigate(['/login']); 
        }
        return throwError(() => error);
      })
    );
  }
  return next (req);
}
