import { Component, Input } from '@angular/core';
import { ImageResponse } from '../../models/image-res';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ImageCardResponse } from '../../models/image-card-res';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input() data!: ImageCardResponse;
  @Input() color!: string;
  @Input() disabledName: boolean = false;
  @Input() callback?: (data: ImageCardResponse) => void;
}
