import { Component, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faUser,
  faChartColumn,
  faMedal,
  faFileContract,
  faRightFromBracket,
  faImage,
} from '@fortawesome/free-solid-svg-icons';
import { Router, RouterModule } from '@angular/router';


interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    CommonModule,
    MatSelectModule,
    FontAwesomeModule,
    RouterModule,
  ],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})
export class ReportComponent {
  foods: Food[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
  ];
  faUser = faUser;
  faChartColumn = faChartColumn;
  faMedal = faMedal;
  faFileContract = faFileContract;
  faRightFromBracket = faRightFromBracket;
  faImage = faImage;

  router = inject(Router);

  currentPage: number = 1; // บันทึกหน้าปัจจุบัน
  itemsPerPage: number = 10; // จำนวนรายการต่อหน้า

  nextPage() {
    this.currentPage++; // เพิ่มค่า input เมื่อกด next
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--; // ลดหน้าปัจจุบันเมื่อกด previous
    }
  }

  // คำนวณเลขเริ่มต้นและสิ้นสุดของหน้าปัจจุบัน
  currentPageStartIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage; // ลดค่าลง 1
  }

  currentPageEndIndex(): number {
    return this.currentPage * this.itemsPerPage - 1; // ลดค่าลง 1
  }
}

