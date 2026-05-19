import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { PlayerService } from '../services/player/player.service';


import { Chart, RadarController, LinearScale, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

@Component({
  selector: 'app-player-detail',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, RouterModule],
  templateUrl: './player-detail.html'
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
    
    this.route.paramMap.subscribe(params => {
      this.playerId = params.get('id');
      
      if (this.playerId) {
        
        this.playerData = null; 

        this.playerService.getPlayerById(this.playerId).subscribe({
          next: (player: any) => {  
            this.playerData = player;
            
            this.radarChartData = {
              labels: this.radarChartLabels,
              datasets: [
                {
                  data: [
                    player.pace || 0,
                    player.shooting || 0,
                    player.passing || 0,
                    player.dribbling || 0,
                    player.defending || 0,
                    player.physic || 0 //
                  ],
                  label: `Skills de ${player.longName || player.name || 'Jugador'}`
                }
              ]
            };
          },
          error: (err: any) => console.error('Error al traer detalles del jugador:', err)
        });
      }
    });
  }
}