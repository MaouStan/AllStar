import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VoteComponent } from './pages/vote/vote.component';
import { JoinComponent } from './pages/auth/join/join.component';
import { SigninComponent } from './pages/auth/signin/signin.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { LogoutComponent } from './pages/auth/logout/logout.component';
import { ChartComponent } from './pages/chart/chart.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { UploadComponent } from './pages/upload/upload.component';
import { RankingComponent } from './pages/ranking/ranking.component';
import { AuthGuard } from './auth.guard';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { AdminComponent } from './pages/admin/admin.component';
import { UserComponent } from './pages/admin/user/user.component';
import { RanksComponent } from './pages/admin/ranks/ranks.component';
import { ReportComponent } from './pages/admin/report/report.component';
import { DetailComponent } from './pages/admin/detail/detail.component';

export const routes: Routes = [

  { path: 'home', component: VoteComponent },
  { path: 'auth/join', component: JoinComponent },
  { path: 'auth/signin', component: SigninComponent },
  { path: 'auth/signup', component: SignupComponent },
  { path: 'auth/logout', component: LogoutComponent },
  { path: 'chart/:userId', component: ChartComponent, canActivate: [AuthGuard] },
  { path: 'change', component: ChangePasswordComponent, canActivate: [AuthGuard] },
  { path: 'ranking', component: RankingComponent },
  { path: 'upload', component: UploadComponent, canActivate: [AuthGuard] },

  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'user', component: UserComponent },
      { path: 'ranks', component: RanksComponent },
      { path: 'report', component: ReportComponent },
      { path: 'detail', component: DetailComponent },
    ]
  },

  { path: '', redirectTo: 'home', pathMatch: 'full' },
];

// Create the AppRoutingModule
@NgModule({
  imports: [RouterModule.forRoot(routes)], // Import the RouterModule and configure the routes
  exports: [RouterModule], // Export the RouterModule to make it available for other modules
})
export class AppRoutingModule { }
