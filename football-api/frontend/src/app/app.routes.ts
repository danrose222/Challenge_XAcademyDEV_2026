import { Routes } from '@angular/router';
import { PlayerDetailComponent } from './player-detail/player-detail'

export const routes: Routes = [
  // Solo dejamos la ruta del jugador. La tabla ya se carga por defecto.
 { path: 'player/:id', component: PlayerDetailComponent }
];
