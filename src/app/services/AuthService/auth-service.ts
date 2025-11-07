import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { Registro } from '../../models/registro';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({ providedIn: 'root' })
export class AuthService {
  
  private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());
  private administrador = new BehaviorSubject<boolean>(this.isLoggedIn());

  isLoggedIn$ = this.loggedIn.asObservable();

  isAdmin$ = this.administrador.asObservable();

  constructor(private http: HttpClient) {}

  register(userData: Registro): Observable <any>{
    return this.http.post(`/api/auth/register`, userData, {responseType: 'text'});
  }

  login(username: string, password: string) {
    return this.http.post<{ token: string }>(`/api/auth/login`, { username, password })
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);

          this.loggedIn.next(true);
        })
      );
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
  localStorage.removeItem('token');
  this.loggedIn.next(false);   
  this.administrador.next(false); 
}


  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    // Implementación más completa verificaría la expiración del token
    return !!token; 
  }

  // Función para obtener el rol del token
  getRol(): string[] | null {
    const token = localStorage.getItem('token');
    if (token) {
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
      return decodedToken.roles; // Asumiendo que el rol está en 'role'
    }
    return null;
  }

  // Función para verificar si el usuario es admin
  isAdmin(): boolean {
    const userRoles = this.getRol();
    if(userRoles){
      return userRoles.includes('ADMIN');
    }

    return false;
  }

}