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
import { AdminComponent } from './pages/admin/admin.component';
import { AdminRanksComponent } from './pages/admin-ranks/admin-ranks.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AdminReportComponent } from './pages/admin-report/admin-report.component';
import { AdminDetailsComponent } from './pages/admin-details/admin-details.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: VotingComponent },
  { path: 'ranking', component: RankingComponent },
  { path: 'ad-user', component: AdminComponent },
  { path: 'ad-ranks', component: AdminRanksComponent },
  { path: 'ad-dash', component: AdminDashboardComponent },
  { path: 'ad-report', component: AdminReportComponent},
  { path: 'ad-details', component: AdminDetailsComponent},

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

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
