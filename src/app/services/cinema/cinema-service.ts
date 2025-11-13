// src/app/services/sala/sala-service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sala } from '../../models/sala';

@Injectable({
  providedIn: 'root'
})
export class CinemaService {

  salas: Sala[];
  salasBd: Sala[];
  selectedSala?: Sala;

  constructor(private http: HttpClient) {
    this.salas = [];
    this.salasBd = [];
  }

  // ===== CRUD principal =====

  //METODOS GET
  getSalas(): Observable<Sala[]> {
    return this.http.get<Sala[]>('/api/cinemas');
  }

  getSala(id: number): Observable<Sala> {
    return this.http.get<Sala>(`/api/cinemas/${id}`);
  }

  getSalasByEnabled(enabled: boolean) {
    return this.http.get<Sala[]>(`/api/cinemas/enabled/${enabled}`);
  }
  
  getSalaByName(name: string): Observable<Sala[]> {
    return this.http.get<Sala[]>(`/api/cinemas/search?name=${encodeURIComponent(name)}`);
  }

  //METODO PUT
  putSala(id: number, sala: any): Observable<any> {
      return this.http.put(`/api/cinemas/update/${id}`, sala);
  }
 
  //METODO POST
  postSala(sala : Sala): Observable<Sala> {
    return this.http.post<Sala>(`/api/cinemas/create`, sala);
  }

  //METODO DELETE
  deleteSala(id: string | number): Observable<void> {
    return this.http.delete<void>(`/api/cinemas/delete/${id}`);
  }

  //vaciar array salas
  vaciarSalas(): void {
    this.salas = [];
  }

  //traer sala seleccionada
  seleccionarSala(sala: Sala): void {
    this.selectedSala = sala;
  }

}