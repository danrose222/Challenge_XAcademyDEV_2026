import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PlayerService } from './services/player/player.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  players: any[] = []; 
  filteredPlayers: any[] = []; 
  searchTerm: string = ''; 

  // Variables de paginación
  currentPage: number = 1;
  totalPages: number = 1;
  totalRecords: number = 0;

  constructor(private playerService: PlayerService) {}

  ngOnInit(): void {
    this.cargarLista();
  }

  cargarLista(): void {
    this.playerService.getPlayers(this.currentPage).subscribe({
      next: (response: any) => {
        this.players = response.data || []; 
        this.filteredPlayers = [...this.players]; 
        
        // Guardamos los datos de paginación
        this.totalPages = response.totalPages || 1;
        this.totalRecords = response.total || 0;
      },
      error: (err: any) => {
        console.error('Error al traer los jugadores:', err);
      }
    });
  }

  siguientePagina(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.cargarLista();
    }
  }

  paginaAnterior(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.cargarLista();
    }
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase().trim();
    
    this.filteredPlayers = this.players.filter(player => {
      const name = (player.dataValues?.longName || player.longName || player.name || '').toLowerCase();
      const club = (player.dataValues?.clubName || player.clubName || player.club || '').toLowerCase();
      
      return name.includes(term) || club.includes(term);
    });
  }

  exportToCSV(): void {
    if (this.filteredPlayers.length === 0) return;

    const headers = ['Nombre', 'Club', 'Nacionalidad', 'Rating', 'Edad'];
    const csvRows = [headers.join(',')];

    for (const player of this.filteredPlayers) {
      const name = player.dataValues?.longName || player.longName || player.name || '';
      const club = player.dataValues?.clubName || player.clubName || player.club || '';
      const nationality = player.dataValues?.nationalityName || player.nationalityName || player.nationality || '';
      const rating = player.dataValues?.overall || player.overall || player.rating || '';
      const age = player.dataValues?.age || player.age || '';

      const row = [`"${name}"`, `"${club}"`, `"${nationality}"`, rating, age];
      csvRows.push(row.join(','));
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jugadores_filtrados.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}