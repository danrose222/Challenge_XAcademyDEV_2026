import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { PlayerService } from '../services/player/player.service';
import { Chart, RadarController, LinearScale, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { PlayerTimelineComponent } from '../components/player-timeline/player-timeline';

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

@Component({
  selector: 'app-player-detail',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, RouterModule, PlayerTimelineComponent],
  templateUrl: './player-detail.html'
})
export class PlayerDetailComponent implements OnInit {
  analisisIA: string = '';
  cargandoAnalisis: boolean = false;
  playerId: string | null = null;
  playerIdNum: number = 0;
  playerData: any = null; 

  public radarChartOptions: ChartConfiguration['options'] = { 
    responsive: true,
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        pointLabels: { color: '#8da9c4', font: { size: 14, family: 'Oswald, sans-serif' } },
        ticks: { backdropColor: 'transparent', color: 'rgba(255, 255, 255, 0.5)' }
      }
    },
    plugins: {
      legend: { labels: { color: '#ffffff', font: { family: 'Roboto, sans-serif' } } }
    }
  };
  
  public radarChartLabels: string[] = ['Ritmo', 'Tiro', 'Pase', 'Regate', 'Defensa', 'Físico'];
  
  public radarChartData: ChartData<'radar'> = {
    labels: this.radarChartLabels,
    datasets: [{ 
      data: [0, 0, 0, 0, 0, 0], 
      label: 'Skills del Jugador',
      backgroundColor: 'rgba(0, 255, 135, 0.2)',
      borderColor: '#00ff87'
    }]
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
        this.playerIdNum = Number(this.playerId);
        console.log('📌 ID recibido con éxito:', this.playerIdNum);

        this.playerService.getPlayerById(this.playerId).subscribe({
          next: (player: any) => {
            
            player.longName = this.limpiarTexto(player.longName);
            player.name = this.limpiarTexto(player.name);
            player.clubName = this.limpiarTexto(player.clubName);
            player.nationalityName = this.limpiarTexto(player.nationalityName);
            
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
                    player.physic || 0 
                  ],
                  label: `Skills de ${player.longName || player.name || 'Jugador'}`, 
                  backgroundColor: 'rgba(0, 255, 135, 0.2)',
                  borderColor: '#00ff87',
                  pointBackgroundColor: '#0b132b',
                  pointBorderColor: '#00ff87',
                  pointHoverBackgroundColor: '#00ff87',
                  pointHoverBorderColor: '#fff'
                }
              ]
            };
          },
          error: (err: any) => console.error('Error al traer detalles del jugador:', err)
        });
      }
    });
  }

  limpiarTexto(texto: string): string {
    if (!texto) return '';
    try {
      return decodeURIComponent(escape(texto));
    } catch (e) {
      return texto;
    }
  }

  obtenerAnalisisIA() {
    if (!this.playerId) return;

    this.cargandoAnalisis = true; 
    this.analisisIA = ''; 
    this.playerService.analizarEvolucion(Number(this.playerId)).subscribe({
      next: (resultado) => {
        this.analisisIA = resultado; 
        this.cargandoAnalisis = false; 
      },
      error: (err) => {
        console.error('Error obteniendo análisis de IA', err);
        this.analisisIA = 'Hubo un error al intentar consultar a la IA. Por favor, intenta de nuevo.';
        this.cargandoAnalisis = false;
      }
    });
  }
}