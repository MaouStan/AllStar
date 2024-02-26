import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar-edit',
  standalone: true,
  imports: [RouterModule, FontAwesomeModule],
  templateUrl: './navbar-edit.component.html',
  styleUrl: './navbar-edit.component.scss'
})
export class NavbarEditComponent {
  faBars = faBars;
}
