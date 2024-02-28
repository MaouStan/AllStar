import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { StorageService } from '../../services/storage.service';
import { UserRes } from '../../models/user-res';

@Component({
  selector: 'app-navbar-user',
  standalone: true,
  imports: [FontAwesomeModule, RouterModule, CommonModule],
  templateUrl: './navbar-user.component.html',
  styleUrl: './navbar-user.component.scss',
})
export class NavbarUserComponent {
  constructor(private storageService: StorageService) {}
  faBars = faBars;
  faTimes = faTimes;
  isOpened: boolean = false;
  user: UserRes = this.storageService.getUser();
}
