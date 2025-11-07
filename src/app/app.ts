// src/app/app.component.ts (Ejemplo con módulos)

import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/AuthService/auth-service';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { HeaderAdmin } from './components/header-admin/header-admin';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Header,Footer,HeaderAdmin],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  isLoggedIn$!: boolean; // Variable para el estado de login
  
  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Suscribirse al estado de login expuesto por el servicio
    this.isLoggedIn$ = this.authService.isLoggedIn();
  }

  onLogout() {
    this.authService.logout();
  }
}
