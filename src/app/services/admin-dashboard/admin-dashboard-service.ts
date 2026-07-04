import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminDashboard } from '../../models/adminDashboard';

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {

  constructor(private http: HttpClient) {}

  getDashboard(from?: string, to?: string): Observable<AdminDashboard> {
    let params = new HttpParams();

    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);

    return this.http.get<AdminDashboard>('/api/admin/dashboard', { params });
  }
}
