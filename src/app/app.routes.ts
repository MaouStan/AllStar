import { Routes } from '@angular/router';
import { VotingComponent } from './pages/voting/voting.component';

export const routes: Routes = [
  // handle home
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  {
    path: 'home',
    component: VotingComponent,
  },

  // handle 404
  { path: '**', redirectTo: 'home' }
];
