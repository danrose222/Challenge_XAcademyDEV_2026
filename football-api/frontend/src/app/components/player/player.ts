import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PlayerService } from '../../services/player/player.service';

export interface Player {
  [key: string]: any;
}

@Component({
  selector: 'app-player',
  templateUrl: './player.html',
  styleUrls: ['./player.css'],
  imports: [CommonModule, RouterModule],
  standalone: true
})
export class PlayerComponent implements OnInit {
  
  players: Player[] = []; 
  errorMessage: string = '';

  constructor(private playerService: PlayerService) {}

  ngOnInit(): void {
  
    this.playerService.getPlayers().subscribe({
      next: (data: any) => {
       
        this.players = data; 
      },
      error: (err: any) => {
        console.error(err);
        this.errorMessage = 'Error al cargar la lista de jugadores';
      }
    });
  }
}