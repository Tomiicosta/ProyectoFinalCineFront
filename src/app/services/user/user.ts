import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserService {

  private api = 'http://localhost:8080/api/userManagement';

  constructor(private http: HttpClient) {}

  getMyProfile() {
    return this.http.get<any>(`${this.api}/me`);
  }

  updateMyProfile(body: any) {
    return this.http.put<any>(`${this.api}/me/update`, body);
  }
}