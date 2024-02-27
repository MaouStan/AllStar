import { Routes } from '@angular/router';
import { VotingComponent } from './pages/voting/voting.component';
import { EditComponent } from './pages/edit/edit.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { UploadComponent } from './pages/upload/upload.component';
import { SignInComponent } from './pages/signin/signin.component';
import { SignUpComponent } from './pages/signup/signup.component';

export const routes: Routes = [
  // handle home
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: VotingComponent },
  { path: 'edit', component: EditComponent },
  { path: 'change', component: ChangePasswordComponent },
  { path: 'upload', component: UploadComponent },
  { path: 'signin', component: SignInComponent },
  { path: 'signup', component: SignUpComponent },

  // handle 404
  { path: '**', redirectTo: 'home' },
];
