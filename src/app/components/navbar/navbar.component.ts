import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { NavbarUserComponent } from "../navbar-user/navbar-user.component";

@Component({
    selector: 'app-navbar',
    standalone: true,
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
    imports: [RouterModule, FontAwesomeModule, CommonModule, NavbarUserComponent]
})
export class NavbarComponent {
  faBars = faBars;
  isSigned: boolean = false;
}
