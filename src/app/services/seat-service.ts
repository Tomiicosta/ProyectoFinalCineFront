import { Injectable } from '@angular/core';
import { Butaca } from '../models/butaca';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SeatService {

  constructor(private http: HttpClient) {}

  getSeat(id: number) {
    return this.http.get<Butaca>(`/api/seats/${id}`);
  }
  
}
