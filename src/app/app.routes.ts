import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VotingComponent } from './pages/voting/voting.component';
import { EditComponent } from './pages/edit/edit.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { UploadComponent } from './pages/upload/upload.component';
import { SignInComponent } from './pages/signin/signin.component';
import { SignUpComponent } from './pages/signup/signup.component';
import { JoinComponent } from './pages/join/join.component';
import { AuthService } from './services/auth.service';
import { LogoutComponent } from './pages/logout/logout.component';
import { RankingComponent } from './pages/ranking/ranking.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: VotingComponent },
  { path: 'edit1', component: EditComponent, canActivate: [AuthService] },
  { path: 'ranking', component: RankingComponent },

  { path: 'home', component: VotingComponent },
  { path: 'edit', component: EditComponent },
  {
    path: 'change',
    component: ChangePasswordComponent,
  },
  { path: 'upload', component: UploadComponent },
  { path: 'signin', component: SignInComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'join', component: JoinComponent },
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
