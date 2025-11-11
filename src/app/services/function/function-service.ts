import { Injectable } from '@angular/core';
import { Funcion } from '../../models/funcion';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Butaca } from '../../models/butaca';

const BASE_URL = 'http://localhost:8080/api/functions';

@Injectable({
  providedIn: 'root'
})
export class FunctionService {

  funciones: Funcion[] = [];

  constructor(private http: HttpClient) {}

  // LISTAR
  getFunciones(): Observable<Funcion[]> {
    return this.http.get<Funcion[]>(`${BASE_URL}`);
  }

  getFuncionById(id: number): Observable<Funcion> {
    return this.http.get<Funcion>(`${BASE_URL}/${id}`);
  }

  // VARIANTES DE LECTURA (si las usás en el front)
  getDisponiblesPorPelicula(movieId: number): Observable<Funcion[]> {
    return this.http.get<Funcion[]>(`${BASE_URL}/available/${movieId}`);
  }

  // Trae las butacas segun la funcion
  getSeatsByFunction(functionId: number) {
    return this.http.get<Butaca[]>(`/api/functions/${functionId}/seats`);
  }

  getPorSala(cinemaId: number): Observable<Funcion[]> {
    return this.http.get<Funcion[]>(`${BASE_URL}/cinema/${cinemaId}`);
  }

  // CREAR
  postFuncion(payload: any): Observable<Funcion> {
    return this.http.post<Funcion>(`${BASE_URL}/create`, payload);
  }

  // ACTUALIZAR
  putFuncion(id: number, payload: any): Observable<Funcion> {
    return this.http.put<Funcion>(`${BASE_URL}/update/${id}`, payload);
  }

  // ELIMINAR
  deleteFuncion(id: number) {
    return this.http.delete<Funcion>(`/api/functions/delete/${id}`);
  }
}
