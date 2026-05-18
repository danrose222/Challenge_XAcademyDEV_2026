import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private apiUrl = 'http://localhost:3000/api'; 

  constructor(private http: HttpClient) {}

  getPlayers(page: number = 1, limit: number = 20): Observable<any> {
  
    return this.http.get(`${this.apiUrl}/players?page=${page}&limit=${limit}`);
  }

  getPlayerById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/players/${id}`);
  }
}