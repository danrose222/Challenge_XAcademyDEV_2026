import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../../services/player/player.service'; 
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, Chart, registerables, ChartArea } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-player-timeline',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './player-timeline.html',
  styleUrls: ['./player-timeline.css']
})
export class PlayerTimelineComponent implements OnInit, OnChanges {
  @Input() playerId!: number;
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  historico: any[] = [];
  cargando: boolean = false;
  habilidadActual: string = 'overall';

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Puntaje',
        fill: true,
        tension: 0.45,
        borderColor: '#7b2cbf',
        borderWidth: 3,
        pointBackgroundColor: '#7b2cbf',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        backgroundColor: (context) => {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          if (!chartArea) return undefined; 
          return this.getGradient(ctx, chartArea);
        },
      }
    ]
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(31, 41, 55, 0.9)',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        cornerRadius: 8,
        displayColors: false
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#6b7280', font: { size: 12 } }
      },
      y: {
        min: 40,
        max: 100,
        border: { display: false },
        grid: { color: 'rgba(243, 244, 246, 0.6)' },
        ticks: {
          stepSize: 10,
          color: '#6b7280',
          font: { size: 12 }
        }
      }
    }
  };

  mapaHabilidades: { [key: string]: string } = {
    overall: 'Rating Global',
    pace: 'Ritmo',
    shooting: 'Tiro',
    passing: 'Pase',
    dribbling: 'Regate',
    defending: 'Defensa',
    physic: 'Físico'
  };

  constructor(private playerService: PlayerService) { }

  ngOnInit(): void {
    if (this.playerId) this.cargarHistorial();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['playerId'] && !changes['playerId'].firstChange) {
      this.cargarHistorial();
    }
  }

  cargarHistorial() {
    this.cargando = true;
    this.playerService.getHistorialJugador(this.playerId).subscribe({
      next: (data: any) => { 
        this.historico = data;
        this.actualizarGrafico();
        this.cargando = false;
      },
      error: (err: any) => { 
        console.error('Error al traer historial:', err);
        this.cargando = false;
      }
    });
  }

  cambiarHabilidad(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.habilidadActual = selectElement.value;
    this.actualizarGrafico();
  }

  actualizarGrafico() {
    if (!this.historico || this.historico.length === 0) return;
    this.lineChartData.labels = this.historico.map(h => `'${h.fifaVersion}`);
    this.lineChartData.datasets[0].data = this.historico.map(h => h[this.habilidadActual]);
    
  
    if (this.chart) {
      this.chart.update();
    }
    this.lineChartData = { ...this.lineChartData };
  }

  private getGradient(ctx: CanvasRenderingContext2D, chartArea: ChartArea) {
    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, 'rgba(123, 44, 191, 0)');
    gradient.addColorStop(1, 'rgba(123, 44, 191, 0.25)');
    return gradient;
  }
}