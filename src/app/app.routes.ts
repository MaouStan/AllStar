import { Routes } from '@angular/router';
import { VotingComponent } from './pages/voting/voting.component';
import { EditComponent } from './pages/edit/edit.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { UploadComponent } from './pages/upload/upload.component';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';

export const routes: Routes = [
  // handle home
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: VotingComponent,},
  { path: 'edit', component: EditComponent,},
  { path: 'editprofile', component: EditProfileComponent,},
  { path: 'change', component: ChangePasswordComponent,},
  { path: 'upload', component: UploadComponent,},
  
  // handle 404
  { path: '**', redirectTo: 'home' },
];
