import { Routes } from '@angular/router';
import { PlayerComponent } from './components/player/player';
import { PlayerDetailComponent } from './player-detail/player-detail';
import { LoginComponent } from './components/login/login';

export const routes: Routes = [
  { 
    path: '', 
    component: PlayerComponent 
  },

 { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: 'player-detail/:id', 
    component: PlayerDetailComponent 
  }
];