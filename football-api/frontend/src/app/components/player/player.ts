import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; 
import { PlayerService } from '../../services/player/player.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.html',
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule], 
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
  playerForm: FormGroup;
  isEditing: boolean = false;
  editingPlayerId: number | null = null;

  constructor(private playerService: PlayerService, private fb: FormBuilder) {
    
    this.playerForm = this.fb.group({
      name: ['', Validators.required],
      club: ['', Validators.required],
      position: ['', Validators.required],
      nationality: ['', Validators.required],
      rating: ['', [Validators.required, Validators.min(1), Validators.max(99)]]
    });
  }

  ngOnInit(): void {
    this.cargarJugadores();
  }

  cargarJugadores(): void {
    
    this.playerService.getPlayers(this.currentPage, this.limit, this.searchTerm).subscribe({
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
    this.currentPage = 1;
    this.cargarJugadores();
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
    let url = 'http://localhost:3000/api/players/export';
    
    if (this.searchTerm) {
      url += `?name=${encodeURIComponent(this.searchTerm)}`;
    }
    
    window.open(url, '_blank');
  }

  deletePlayer(id: number): void {
    if (confirm('¿Estás segura de que querés eliminar a este jugador?')) {
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

  abrirModoEdicion(player: any): void {
    this.isEditing = true;
    this.editingPlayerId = player.id || player.dataValues?.id;
    
    this.playerForm.patchValue({
      name: player.dataValues?.longName || player.longName || player.name || '',
      club: player.dataValues?.clubName || player.clubName || player.club || '',
      position: player.dataValues?.clubPosition || player.position || '',
      nationality: player.dataValues?.nationalityName || player.nationality || '',
      rating: player.dataValues?.overall || player.rating || ''
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  guardarEdicion(): void {
    if (this.playerForm.valid && this.editingPlayerId) {
      
      const datosValidos = {
        longName: this.playerForm.value.name,
        clubName: this.playerForm.value.club,
        playerPositions: this.playerForm.value.position,
        nationalityName: this.playerForm.value.nationality,
        overall: Number(this.playerForm.value.rating)
      };

      this.playerService.updatePlayer(this.editingPlayerId, datosValidos).subscribe({
        next: () => {
          this.mostrarNotificacion('Jugador actualizado con éxito');
          this.cancelarEdicion();
          this.cargarJugadores();
        },
        
        error: (err: any) => {
          console.error('Error al actualizar:', err);
          this.errorMessage = 'No se pudo actualizar el jugador.';
        }
      });
    } else {
      this.mostrarNotificacion('Por favor, completá todos los campos correctamente.');
    }
  }

  cancelarEdicion(): void {
    this.isEditing = false;
    this.editingPlayerId = null;
    this.playerForm.reset();
  }

  mostrarNotificacion(mensaje: string): void {
    alert(mensaje); 
  }
}