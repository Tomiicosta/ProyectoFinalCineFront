import { Injectable } from '@angular/core';
import { Butaca } from '../models/butaca';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SeatService {

  private api = 'http://localhost:8080/api/seats';

  constructor(private http: HttpClient) {}

  getSeat(id: number) {
    return this.http.get<Butaca>(`${this.api}/${id}`);
  }
  
}
