import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private apiUrl = 'http://localhost:3000/api'; 

  constructor(private http: HttpClient) {}

  // 1. LE DEVOLVEMOS ESTE MÉTODO A TU TABLA (Para solucionar los primeros 2 errores)
  getPlayers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/players`);
  }

  // 2. EL MÉTODO NUEVO PARA TU GRÁFICO DE RADAR
  getPlayerById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/players/${id}`);
  }
}