import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/AuthService/auth-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  menuAbierto = false;

constructor (public authService: AuthService){
  }

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
