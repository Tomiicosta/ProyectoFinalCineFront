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

  constructor(private authService :AuthService){}

  onLogout() {
  this.authService.logout();
}

}
