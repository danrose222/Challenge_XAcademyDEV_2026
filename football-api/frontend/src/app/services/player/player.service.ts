import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private apiUrl = 'http://localhost:3000/api'; 

  constructor(private http: HttpClient) {}

  analizarEvolucion(id: number): Observable<string> {
    return this.http.get(`${this.apiUrl}/players/analyze/${id}`, { responseType: 'text' });
  }

  getPlayers(page: number = 1, limit: number = 20, name?: string, club?: string): Observable<any> {
    let url = `${this.apiUrl}/players?page=${page}&limit=${limit}`;

    if (name) {
      url += `&name=${name}`;
    }

    if (club) {
      url += `&club=${club}`;
    }

    return this.http.get(url);
  }

  getPlayerById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/players/${id}`);
  }

  getHistorialJugador(id: number): Observable<any[]> {
    
    return this.http.get<any[]>(`http://localhost:3000/api/players/${id}/history`);
  }

  createPlayer(playerData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/players`, playerData);
  }

  deletePlayer(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/players/${id}`);
  }

  updatePlayer(id: number, playerData: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/players/${id}`, playerData);
  }
}