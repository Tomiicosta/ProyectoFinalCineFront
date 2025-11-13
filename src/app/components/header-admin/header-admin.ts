import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/AuthService/auth-service';

@Component({
  selector: 'app-header-admin',
  imports: [RouterLink],
  templateUrl: './header-admin.html',
  styleUrl: './header-admin.css',
})
export class HeaderAdmin {

  menuAbierto = false;

  constructor(private authService :AuthService){}

toggleMenu() {
  this.menuAbierto = !this.menuAbierto;
}

cerrarMenu() {
  this.menuAbierto = false;
}

  onLogout() {
  this.authService.logout();
}

}
