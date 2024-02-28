import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VotingComponent } from './pages/voting/voting.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { UploadComponent } from './pages/upload/upload.component';
import { SignInComponent } from './pages/signin/signin.component';
import { SignUpComponent } from './pages/signup/signup.component';
import { JoinComponent } from './pages/join/join.component';
import { AuthService } from './services/auth.service';
import { LogoutComponent } from './pages/logout/logout.component';
import { RankingComponent } from './pages/ranking/ranking.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ChartComponent } from './pages/chart/chart.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: VotingComponent },
  { path: 'ranking', component: RankingComponent },
  {
    path: 'change',
    component: ChangePasswordComponent,
    canActivate: [AuthService],
  },
  {
    path: 'profile/:id',
    component: ProfileComponent,
    canActivate: [AuthService],
  },
  { path: 'chart/:id', component: ChartComponent, canActivate: [AuthService] },
  { path: 'upload', component: UploadComponent },
  { path: 'signin', component: SignInComponent, canActivate: [AuthService] },
  { path: 'signup', component: SignUpComponent, canActivate: [AuthService] },
  { path: 'join', component: JoinComponent, canActivate: [AuthService] },
  { path: 'logout', component: LogoutComponent },

  // handle 404
  { path: '**', redirectTo: 'home' },
];

// Create the AppRoutingModule
@NgModule({
  imports: [RouterModule.forRoot(routes)], // Import the RouterModule and configure the routes
  exports: [RouterModule], // Export the RouterModule to make it available for other modules
})
export class AppRoutingModule {}
