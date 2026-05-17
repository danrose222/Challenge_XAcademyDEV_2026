import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { PlayerService } from 'src/app/services/player.service';

// Importaciones y registro de controladores para Chart.js Radar [cite: 22]
import { Chart, RadarController, LinearScale, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

@Component({
  selector: 'app-player-detail',
  standalone: true,
  imports: [BaseChartDirective, RouterModule],
  templateUrl: './player-detail.html' // <-- Corregido para que coincida con tu archivo real
})
export class PlayerDetailComponent implements OnInit {
  playerId: string | null = null;
  playerData: any = null; 

  public radarChartOptions: ChartConfiguration['options'] = { responsive: true };
  public radarChartLabels: string[] = ['Ritmo', 'Tiro', 'Pase', 'Regate', 'Defensa', 'Físico'];
  
  public radarChartData: ChartData<'radar'> = {
    labels: this.radarChartLabels,
    datasets: [{ data: [0, 0, 0, 0, 0, 0], label: 'Skills del Jugador' }]
  };
  public radarChartType: ChartType = 'radar';

  constructor(
    private route: ActivatedRoute,
    private playerService: PlayerService 
  ) {}

  ngOnInit(): void {
    this.playerId = this.route.snapshot.paramMap.get('id');
    
    if (this.playerId) {
      this.playerService.getPlayerById(this.playerId).subscribe({
        next: (player: any) => {  // <-- Agregado ': any' para evitar el error TS7006
          this.playerData = player;
          
          // Mapeo dinámico de las estadísticas de la base de datos [cite: 5, 22]
          this.radarChartData = {
            labels: this.radarChartLabels,
            datasets: [
              {
                data: [
                  player.pace || player.dataValues?.pace || 0,
                  player.shooting || player.dataValues?.shooting || 0,
                  player.passing || player.dataValues?.passing || 0,
                  player.dribbling || player.dataValues?.dribbling || 0,
                  player.defending || player.dataValues?.defending || 0,
                  player.physical || player.dataValues?.physical || 0
                ],
                label: `Skills de ${player.shortName || player.name || 'Jugador'}`
              }
            ]
          };
        },
        error: (err: any) => console.error('Error al traer detalles del jugador:', err) // <-- Agregado ': any' aquí también
      });
    }
  }
}