import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { PlayerService } from './services/player/player.service';
import * as XLSX from 'xlsx';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet]
})
export class AppComponent implements OnInit {
  players: any[] = [];
  filteredPlayers: any[] = [];
  searchTerm: string = ''; 

  constructor(private playerService: PlayerService) {}

  ngOnInit(): void {
    this.loadPlayers();
  }

  loadPlayers(): void {
    this.playerService.getPlayers().subscribe({
      next: (response: any) => {
        console.log('Respuesta cruda del backend:', response);
        
        if (response && response.data) {
          this.players = response.data;
        } else if (Array.isArray(response)) {
          this.players = response;
        } else {
          this.players = [];
        }

        this.filteredPlayers = [...this.players];
      },
      error: (err: any) => console.error('Error al cargar jugadores:', err)
    });
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredPlayers = [...this.players];
      return;
    }
    
    const search = this.searchTerm.toLowerCase();
    this.filteredPlayers = this.players.filter(player => {
      
      const name = player.dataValues?.longName || player.longName || player.name || '';
      const club = player.dataValues?.clubName || player.clubName || player.club || '';
      return name.toLowerCase().includes(search) || club.toLowerCase().includes(search);
    });
  }
  exportToCSV(): void {
    // 1. Limpiamos y preparamos los datos
    const dataToExport = this.filteredPlayers.map(player => ({
      Nombre: player.dataValues?.longName || player.longName || player.name,
      Club: player.dataValues?.clubName || player.clubName || player.club,
      Nacionalidad: player.dataValues?.nationalityName || player.nationalityName || player.nationality,
      Rating: player.dataValues?.overall || player.overall || player.rating,
      Edad: player.dataValues?.age || player.age
    }));

    // 2. Convertimos a hoja de cálculo
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Jugadores');

    // 3. Forzamos la descarga en CSV
    XLSX.writeFile(workbook, 'Listado_Jugadores.csv', { bookType: 'csv' });
  }
}