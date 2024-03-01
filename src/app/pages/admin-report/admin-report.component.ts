import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';

interface Food {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-admin-report',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, FormsModule, CommonModule,MatSelectModule],
  templateUrl: './admin-report.component.html',
  styleUrl: './admin-report.component.scss',
})
export class AdminReportComponent {
  foods: Food[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
  ];
}
