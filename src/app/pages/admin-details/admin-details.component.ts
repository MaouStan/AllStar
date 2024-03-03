import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser,  faChartColumn, faMedal, faFileContract, faRightFromBracket, faTrashCan, faCheck} from '@fortawesome/free-solid-svg-icons';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-details',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, FormsModule, CommonModule, FontAwesomeModule,RouterModule],
  templateUrl: './admin-details.component.html',
  styleUrl: './admin-details.component.scss',
})
export class AdminDetailsComponent {
  faUser = faUser;
  faChartColumn = faChartColumn;
  faMedal = faMedal;
  faFileContract = faFileContract;
  faRightFromBracket = faRightFromBracket;
  faTrashCan = faTrashCan;
  faCheck = faCheck;
}
