import { Routes } from '@angular/router';
import { PlayerDetailComponent } from './player-detail/player-detail';
export const routes: Routes = [

  { 
    path: 'player-detail/:id', 
    component: PlayerDetailComponent 
  }
];