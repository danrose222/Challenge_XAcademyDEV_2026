import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- Asegúrate de tener esta línea
import { PlayerService } from '../../services/player/player.service';

export interface Player {
  [key: string]: any;
}

@Component({
  selector: 'app-player',
  templateUrl: './player.html',
  styleUrls: ['./player.css'],
  imports: [CommonModule], // <-- AGREGA ESTA LÍNEA AQUÍ
  standalone: true // Si tu componente es standalone (muy probable en esta versión)
})
export class PlayerComponent implements OnInit {
  player: Player | null = null;
  errorMessage: string = '';

  constructor(private playerService: PlayerService) {}

  ngOnInit(): void {
    this.playerService.getPlayers().subscribe({
      next: (data: any) => {
        // Si el backend te devuelve un array completo, tomamos el primer jugador para la vista individual
        this.player = Array.isArray(data) ? data[0] : data;
      },
      error: (err: any) => (this.errorMessage = 'Jugador no encontrado')
    });
  }
}