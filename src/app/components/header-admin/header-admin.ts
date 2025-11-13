import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/AuthService/auth-service';

@Component({
  selector: 'app-header-admin',
  imports: [RouterLink],
  templateUrl: './header-admin.html',
  styleUrl: './header-admin.css',
})
export class HeaderAdmin {

  menuAbierto = false;
  perfilMenuAbierto  = false;

  constructor(private authService :AuthService, private router: Router){}

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

   cerrarMenu() {
    this.menuAbierto = false;
  }

// ===== PERFIL =====
togglePerfilMenu(event: MouseEvent): void {
  event.stopPropagation(); // para que no se cierre por otros handlers
  this.perfilMenuAbierto = !this.perfilMenuAbierto;
  
}



onVerPerfil(): void {
  this.perfilMenuAbierto = false;
  this.menuAbierto = false;

}

onLogout(): void {
  this.authService.logout();
}

onLogoutClick(): void {
  this.onLogout();
  this.perfilMenuAbierto = false;
  this.menuAbierto = false;
  this.router.navigate(['/']);
}

}
