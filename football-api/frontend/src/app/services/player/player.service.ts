import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private apiUrl = 'http://localhost:3000/api'; 

  constructor(private http: HttpClient) {}

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

  
  createPlayer(playerData: any): Observable<any> {
    
    return this.http.post('http://localhost:3000/api/players', playerData);
  }

  deletePlayer(id: number): Observable<any> {
  
  return this.http.delete(`http://localhost:3000/api/players/${id}`);
  }
}