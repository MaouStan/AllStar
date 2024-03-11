import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowDown,
  faArrowUp,
  faTrophy,
  faHeart,
  faEllipsisVertical,
} from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  faTrophy = faTrophy;
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  faHeart = faHeart;
  faEllipsisVertical = faEllipsisVertical;
  Math = Math;

  items = Array(5)
    .fill(0)
    .map(() => ({ isMenuOpen: false }));

  toggleMenu(index: number) {
    this.items[index].isMenuOpen = !this.items[index].isMenuOpen;
  }

  closeMenu(index: number) {
    this.items[index].isMenuOpen = false;
  }
  openMenu(index: number) {
    this.items[index].isMenuOpen = true;
  }
}
