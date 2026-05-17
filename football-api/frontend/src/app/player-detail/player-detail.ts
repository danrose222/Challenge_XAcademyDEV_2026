import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

// 1. Importamos Chart.js y los elementos necesarios para el Radar
import { Chart, RadarController, LinearScale, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

// 2. Registramos oficialmente los componentes en el motor de Chart.js
Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

@Component({
  selector: 'app-player-detail',
  standalone: true,
  imports: [BaseChartDirective, RouterModule],
  templateUrl: './player-detail.html'
})
export class PlayerDetail implements OnInit {
  // 1. ¡Asegúrate de que esta línea exacta esté aquí declarada!
  playerId: string | null = null; 

  // Configuración del Gráfico de Radar
  public radarChartOptions: ChartConfiguration['options'] = { responsive: true };
  public radarChartLabels: string[] = ['Pace (Ritmo)', 'Shooting (Tiro)', 'Passing (Pase)', 'Dribbling (Regate)', 'Defending (Defensa)', 'Physical (Físico)'];
  
  public radarChartData: ChartData<'radar'> = {
    labels: this.radarChartLabels,
    datasets: [
      { data: [90, 85, 80, 92, 40, 70], label: 'Skills del Jugador' }
    ]
  };
  public radarChartType: ChartType = 'radar';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Aquí es donde se le asigna el valor que capturamos de la URL
    this.playerId = this.route.snapshot.paramMap.get('id');
  }
}