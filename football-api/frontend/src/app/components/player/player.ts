import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PlayerService } from '../../services/player/player.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.html',
  imports: [CommonModule, RouterModule, FormsModule],
  standalone: true
})
export class PlayerComponent implements OnInit {

  players: any[] = [];
  filteredPlayers: any[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  totalRecords: number = 0;
  limit: number = 20;

  errorMessage: string = '';

  constructor(private playerService: PlayerService) {}

  ngOnInit(): void {
    this.cargarJugadores();
  }

  cargarJugadores(): void {
    this.playerService.getPlayers(this.currentPage, this.limit).subscribe({
      next: (response: any) => {
       
        if (response && response.data) {
          this.players = response.data;
          this.totalRecords = response.total || response.data.length;
          this.totalPages = response.lastPage || Math.ceil(this.totalRecords / this.limit) || 1;
        } else {
          this.players = Array.isArray(response) ? response : [];
          this.totalRecords = this.players.length;
          this.totalPages = 1;
        }
        
        this.filteredPlayers = [...this.players];
      },
      error: (err: any) => {
        console.error('Error del servidor:', err);
        this.errorMessage = 'Error al cargar la lista de jugadores';
      }
    });
  }

  onSearch(): void {
    if (!this.searchTerm) {
      this.filteredPlayers = [...this.players];
      return;
    }
    const term = this.searchTerm.toLowerCase();
    this.filteredPlayers = this.players.filter(p => {
      const name = (p.dataValues?.longName || p.longName || p.name || '').toLowerCase();
      const club = (p.dataValues?.clubName || p.clubName || p.club || '').toLowerCase();
      return name.includes(term) || club.includes(term);
    });
  }

  paginaAnterior(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.cargarJugadores();
    }
  }

  siguientePagina(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.cargarJugadores();
    }
  }

  exportToCSV(): void {

    window.open('http://localhost:3000/api/players/export', '_blank');
  }

  deletePlayer(id: number): void {
    if (confirm('¿Estás segura de que querés eliminar a esta jugadora?')) {
      this.playerService.deletePlayer(id).subscribe({
        next: () => {
          
          this.mostrarNotificacion('Jugador eliminado con éxito');
          
          this.cargarJugadores();
        },
        error: (err: any) => {
          console.error('Error al eliminar:', err);
          this.errorMessage = 'No se pudo eliminar al jugador.';
        }
      });
    }
  }

  mostrarNotificacion(mensaje: string): void {
    
    alert(mensaje); 
  }
}