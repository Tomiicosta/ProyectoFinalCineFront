import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/AuthService/auth-service';

@Injectable({
  providedIn: 'root'
})

export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate( route: ActivatedRouteSnapshot) : boolean | UrlTree {
    
    //Obtener el rol requerido de la configuración de la ruta
    const requiredRole = route.data['role'] as string;

    if (!requiredRole) {
      //Si no se especifica un rol, permite el acceso por defecto
      return true;
    }

    //Obtener los roles del usuario (usa tu método existente)
    const userRoles = this.authService.getRol(); // Devuelve string[] | null
    
    
    /*Verificaciones de Autenticación y Rol*/
    
    //No está logueado (no hay roles)
    if (!userRoles || userRoles.length === 0) {
      console.log('Acceso denegado: Usuario no autenticado.');
      this.router.navigate(['/']); // Redirigir a login
      return false; 
    }

    //Está logueado, verificar si tiene el rol requerido
    const hasRequiredRole = userRoles.map(role => role.toUpperCase()).includes(requiredRole.toUpperCase());

    if (hasRequiredRole) {
      return true; // Acceso permitido
    } else {
      //Logueado, pero no tiene el rol
      console.log('Acceso denegado');
      this.router.navigate(['/rol-incorrecto']); // Redirigir a una página de acceso denegado
      return false;
    }
  }
}