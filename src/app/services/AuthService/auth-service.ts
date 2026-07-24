import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { Registro } from '../../models/registro';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly jwtHelper = new JwtHelperService();
  private readonly loggedIn = new BehaviorSubject<boolean>(false);
  private readonly administrador = new BehaviorSubject<boolean>(false);
  private currentRoles: string[] = [];

  readonly isLoggedIn$ = this.loggedIn.asObservable();
  readonly isAdmin$ = this.administrador.asObservable();

  constructor(private http: HttpClient) {
    // La interfaz nunca debe asumir un rol antes de validar la sesion guardada.
    this.syncSession();
  }

  // Registra usuario
  register(userData: Registro): Observable<any> {
    return this.http.post(`/api/auth/register`, userData, { responseType: 'text' });
  }

  // Loggea usuario
  login(usernameOrEmail: string, password: string) {
    return this.http
      .post<{ token: string }>(`/api/auth/login`, { usernameOrEmail, password })
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          this.syncSession();
        })
      );
  }

  // Obtiene solamente un token vigente.
  getToken(): string | null {
    return this.syncSession();
  }

  logout(): void {
    localStorage.removeItem('token');
    this.setSessionState(false, []);
  }

  isLoggedIn(): boolean {
    return this.syncSession() !== null;
  }

  getRol(): string[] | null {
    return this.syncSession() ? [...this.currentRoles] : null;
  }

  isAdmin(): boolean {
    this.syncSession();
    return this.administrador.value;
  }

  /**
   * Valida la sesion antes de publicarla. Un JWT vencido o malformado
   * se elimina para que la aplicacion arranque como cliente/invitado.
   */
  private syncSession(): string | null {
    const token = localStorage.getItem('token');

    if (!token) {
      this.setSessionState(false, []);
      return null;
    }

    try {
      if (this.jwtHelper.isTokenExpired(token)) {
        this.clearInvalidSession();
        return null;
      }

      const decodedToken = this.jwtHelper.decodeToken(token);
      if (!decodedToken || typeof decodedToken !== 'object') {
        this.clearInvalidSession();
        return null;
      }

      const rolesClaim = decodedToken['roles'];
      const roles = Array.isArray(rolesClaim)
        ? rolesClaim.filter((role): role is string => typeof role === 'string')
        : typeof rolesClaim === 'string'
          ? [rolesClaim]
          : [];

      this.setSessionState(true, roles);
      return token;
    } catch {
      this.clearInvalidSession();
      return null;
    }
  }

  private clearInvalidSession(): void {
    localStorage.removeItem('token');
    this.setSessionState(false, []);
  }

  private setSessionState(isLoggedIn: boolean, roles: string[]): void {
    this.currentRoles = roles;
    const isAdmin = roles.some(role => role.toUpperCase() === 'ADMIN');

    if (this.loggedIn.value !== isLoggedIn) {
      this.loggedIn.next(isLoggedIn);
    }

    if (this.administrador.value !== isAdmin) {
      this.administrador.next(isAdmin);
    }
  }
}
