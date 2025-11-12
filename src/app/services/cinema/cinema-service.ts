// src/app/services/sala/sala-service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sala } from '../../models/sala';

@Injectable({
  providedIn: 'root'
})
export class CinemaService {

  readonly API_URL = 'http://localhost:8080/api/cinemas';

  salas: Sala[];
  salasBd: Sala[];
  selectedSala?: Sala;

  constructor(private http: HttpClient) {
    this.salas = [];
    this.salasBd = [];
  }

  // ===== CRUD principal =====
  getSalas(): Observable<Sala[]> {
    return this.http.get<Sala[]>(this.API_URL);
  }

  getSala(id: number): Observable<Sala> {
    return this.http.get<Sala>(`${this.API_URL}/${id}`);
  }

  getSalasByEnabled(enabled: boolean) {
    return this.http.get<Sala[]>(`${this.API_URL}/enabled/${enabled}`);
  }
  
  getSalaByName(name: string): Observable<Sala[]> {
    return this.http.get<Sala[]>(`${this.API_URL}/search?name=${encodeURIComponent(name)}`);
  }

  putSala(id: number, sala: any): Observable<any> {
      return this.http.put(`${this.API_URL}/update/${id}`, sala);
  }
 
  postSala(sala : Sala): Observable<Sala> {
    return this.http.post<Sala>(`${this.API_URL}/create`, sala);
  }

  deleteSala(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/delete/${id}`);
  }

  vaciarSalas(): void {
    this.salas = [];
  }

  seleccionarSala(sala: Sala): void {
    this.selectedSala = sala;
  }

}