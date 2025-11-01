import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  
  private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());

  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post<{ token: string }>(`${environment.urlApi}auth/login`, { username, password })
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
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    // Implementación más completa verificaría la expiración del token
    return !!token; 
  }
}