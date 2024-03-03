import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser,  faChartColumn, faMedal, faFileContract, faRightFromBracket,faImage} from '@fortawesome/free-solid-svg-icons';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    CommonModule,
    FontAwesomeModule,
    RouterModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {
  faUser = faUser;
  faChartColumn = faChartColumn;
  faMedal = faMedal;
  faFileContract = faFileContract;
  faRightFromBracket = faRightFromBracket;
  faImage = faImage;
}
