import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Compra } from '../../models/compra';
import { Ticket } from '../../models/ticket';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  //Ver mi perfil
  getMyProfile() {
    return this.http.get<any>(`/api/userManagement/me`);
  }

  //Modificar mi perfil
  updateMyProfile(body: any) {
    return this.http.put<any>(`/api/userManagement/me/update`, body);
  }

  //Ver mis tickets
  getMyTickets() {
    return this.http.get<Ticket[]>('http://localhost:8080/api/tickets');
  }
}