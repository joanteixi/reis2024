import { Routes } from '@angular/router';
import { PlayerComponent } from './player/player.component';
import { LandingComponent } from './landing/landing.component';

export const routes: Routes = [
    { path: 'player/:id', component: PlayerComponent   },
    { path: '', component: LandingComponent}
];