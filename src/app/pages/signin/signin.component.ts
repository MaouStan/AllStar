import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowDown,
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';
import { AllStarService } from '../../services/api/allstar.service';
import { UserRes } from '../../models/user-res';
import { StorageService } from '../../services/storage.service';
import { compareSync } from 'bcryptjs';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [MatButtonModule, FontAwesomeModule, RouterLink],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
})
export class SignInComponent {
  constructor(
    private allStarService: AllStarService,
    private storageService: StorageService
  ) {}

  faArrowDown = faArrowDown;
  eye1: typeof faEye | typeof faEyeSlash = faEye;

  togglePasswordVisibility(input: HTMLInputElement) {
    input.type = input.type === 'password' ? 'text' : 'password';
    this.eye1 = input.type === 'password' ? faEye : faEyeSlash;
  }

  async signIn($event: Event) {
    $event.preventDefault();
    // get by username
    const username = ($event.target as HTMLFormElement)['username'].value;
    const password = ($event.target as HTMLFormElement)['password'].value;
    const user: UserRes = (
      await this.allStarService.getUserByUsername(username)
    )[0];

    // check hash verify
    if (user && compareSync(password, user.password)) {
      this.storageService.clean();
      this.storageService.saveUser(user);
      alert('Logged in successfully');
      // goto /
      window.location.href = '/';
    } else {
      alert('Invalid username or password');
    }
  }
}
