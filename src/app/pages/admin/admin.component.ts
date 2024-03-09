import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { faChartColumn, faFileContract, faMedal, faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, RouterModule, FontAwesomeModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  faRightFromBracket = faRightFromBracket;
  faChartColumn = faChartColumn;
  faUser = faUser;
  faMedal = faMedal;
  faFileContract = faFileContract;
}
