import { Injectable } from '@angular/core';
import { Funcion } from '../../models/funcion';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Butaca } from '../../models/butaca';

@Injectable({
  providedIn: 'root'
})
export class FunctionService {

  funciones: Funcion[] = [];

  constructor(private http: HttpClient) {}

  // LISTAR
  getFunciones(): Observable<Funcion[]> {
    return this.http.get<Funcion[]>(`/api/functions`);
  }

  getFuncionById(id: number): Observable<Funcion> {
    return this.http.get<Funcion>(`/api/functions/${id}`);
  }

  // VARIANTES DE LECTURA (si las usás en el front)
  getDisponiblesPorPelicula(movieId: number): Observable<Funcion[]> {
    return this.http.get<Funcion[]>(`/api/functions/available/${movieId}`);
  }

  // Trae las butacas segun la funcion
  getSeatsByFunction(functionId: number) {
    return this.http.get<Butaca[]>(`/api/functions/${functionId}/seats`);
  }

  getPorSala(cinemaId: number): Observable<Funcion[]> {
    return this.http.get<Funcion[]>(`/api/functions/cinema/${cinemaId}`);
  }

  // CREAR
  postFuncion(payload: any): Observable<Funcion> {
    return this.http.post<Funcion>(`/api/functions/create`, payload);
  }

  // ACTUALIZAR
  putFuncion(id: number, payload: any): Observable<Funcion> {
    return this.http.put<Funcion>(`/api/functions/update/${id}`, payload);
  }

  // ELIMINAR
  deleteFuncion(id: number) {
    return this.http.delete<Funcion>(`/api/functions/delete/${id}`);
  }
}
