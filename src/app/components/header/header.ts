import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/AuthService/auth-service';
import { StoreOrderService } from '../../services/StoreOrder/store-order-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  menuAbierto = false;
  perfilMenuAbierto = false;
  cartCount: number = 0;

constructor (public authService: AuthService, private storeOrderService: StoreOrderService, private router: Router){}


toggleMenu() {
  this.menuAbierto = !this.menuAbierto;
}
  
cerrarMenu() {
  this.menuAbierto = false;
  this.perfilMenuAbierto = false;
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

ngOnInit() {
  this.storeOrderService.cartItemCount$.subscribe(count => {
    this.cartCount = count;
  });
  
  this.storeOrderService.getActiveCart().subscribe();
}

}
