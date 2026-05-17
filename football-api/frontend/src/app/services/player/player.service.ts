import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  
  private apiUrl = 'http://localhost:3000/api/players';

  constructor(private http: HttpClient) { }

  
  getPlayers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  
  getPlayerById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
