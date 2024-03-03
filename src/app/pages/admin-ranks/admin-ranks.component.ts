import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser,  faChartColumn, faMedal, faFileContract, faRightFromBracket,faImage} from '@fortawesome/free-solid-svg-icons';
import { RouterModule } from '@angular/router';

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-admin-ranks',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatSelectModule,
    CommonModule,
    FontAwesomeModule,
    RouterModule
  ],
  templateUrl: './admin-ranks.component.html',
  styleUrl: './admin-ranks.component.scss',
})
export class AdminRanksComponent {
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
