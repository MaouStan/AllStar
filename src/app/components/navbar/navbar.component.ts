import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { StorageService } from '../../services/storage.service';
import { NavbarUserComponent } from '../navbar-user/navbar-user.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  imports: [RouterModule, FontAwesomeModule, CommonModule, NavbarUserComponent],
})
export class NavbarComponent implements OnInit {
  faBars = faBars;
  faTimes = faTimes;
  isOpened: boolean = false;
  isLoggedIn: boolean = false;
  isAdmin!:boolean;
  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
    this.isAdmin = true//this.storageService.getUser().type == "admin";
    
  }
}
