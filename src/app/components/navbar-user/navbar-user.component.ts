import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar-user',
  standalone: true,
  imports: [RouterModule, FontAwesomeModule],
  templateUrl: './navbar-user.component.html',
  styleUrl: './navbar-user.component.scss',
})
export class NavbarUserComponent {
  faBars = faBars;
}
