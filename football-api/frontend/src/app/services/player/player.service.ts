import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  // Tu URL base original (mantené el puerto que tenías antes, ej: 3000 o 8080)
  private apiUrl = 'http://localhost:3000/api'; 

  constructor(private http: HttpClient) {}

  // ======= MÉTODO 1: EL QUE USA TU LISTA (Dejalo tal cual estaba) =======
  getPlayers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/players`);
  }

  // ======= MÉTODO 2: EL QUE USA TU RADAR (Agregalo acá abajo) =======
  getPlayerById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/players/${id}`);
  }
}