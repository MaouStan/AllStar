import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-1',
  standalone: true,
  imports: [],
  templateUrl: './card-1.component.html',
  styleUrl: './card-1.component.scss'
})
export class Card1Component implements OnInit {
  @Input() color!: string;
  @Input() profile!: string;
  @Input() image!: string;
  @Input() name!: string;

  ngOnInit(): void {
    if (!this.color) {
      this.color = '#f64363';
    } else if (this.color === 'red') {
      this.color = '#f64363';
    } else if (this.color === 'blue') {
      this.color = '#436AF6';
    }
  }
}
