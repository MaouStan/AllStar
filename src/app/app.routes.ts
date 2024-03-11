import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VoteComponent } from './pages/vote/vote.component';
import { JoinComponent } from './pages/auth/join/join.component';
import { SigninComponent } from './pages/auth/signin/signin.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { LogoutComponent } from './pages/auth/logout/logout.component';
import { ChartComponent } from './pages/graph/graph.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { UploadComponent } from './pages/upload/upload.component';
import { AuthGuard } from './auth.guard';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { AdminComponent } from './pages/admin/admin.component';
import { UserComponent } from './pages/admin/user/user.component';
import { RanksComponent } from './pages/admin/ranks/ranks.component';
import { ReportComponent } from './pages/admin/report/report.component';
import { DetailComponent } from './pages/admin/detail/detail.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { Top10Component } from './pages/top10/top10.component';

export const routes: Routes = [

  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: VoteComponent },
      { path: 'auth/join', component: JoinComponent, canActivate: [AuthGuard] },
      { path: 'auth/signin', component: SigninComponent, canActivate: [AuthGuard] },
      { path: 'auth/signup', component: SignupComponent, canActivate: [AuthGuard] },
      { path: 'auth/logout', component: LogoutComponent },
      { path: 'chart/:userId', component: ChartComponent, canActivate: [AuthGuard] },
      { path: 'change', component: ChangePasswordComponent, canActivate: [AuthGuard] },
      { path: 'top10', component: Top10Component },
      { path: 'upload', component: UploadComponent, canActivate: [AuthGuard] },
    ]
  },

  {
    path: 'admin',
    component: AdminComponent,
    // canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UserComponent },
      { path: 'ranks', component: RanksComponent },
      { path: 'reports', component: ReportComponent },
      { path: 'detail', component: DetailComponent },
    ]
  },

  // 404 handler redirect to home
  { path: '**', redirectTo: 'home' }
];

// Create the AppRoutingModule
@NgModule({
  imports: [RouterModule.forRoot(routes)], // Import the RouterModule and configure the routes
  exports: [RouterModule], // Export the RouterModule to make it available for other modules
})
export class AppRoutingModule { }
