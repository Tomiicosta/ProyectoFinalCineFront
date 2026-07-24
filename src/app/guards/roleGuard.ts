import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/AuthService/auth-service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const requiredRole = route.data['role'] as string;

    if (!requiredRole) {
      return true;
    }

    if (!this.authService.isLoggedIn()) {
      return this.router.createUrlTree(['/login']);
    }

    const userRoles = this.authService.getRol() ?? [];
    const hasRequiredRole = userRoles
      .map(role => role.toUpperCase())
      .includes(requiredRole.toUpperCase());

    if (hasRequiredRole) {
      return true;
    }

    // El usuario conserva su sesion de cliente, pero no accede al area admin.
    return this.router.createUrlTree(['/']);
  }
}
