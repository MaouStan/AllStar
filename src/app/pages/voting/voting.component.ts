import { Component, OnInit } from '@angular/core';
import { AllStarService } from '../../services/api/allstar.service';
import { ImageResponse } from '../../models/image-res';
import { CardComponent } from '../../components/card/card.component';
import { CommonModule } from '@angular/common';
import { ImageCardResponse } from '../../models/image-card-res';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-voting',
  standalone: true,
  templateUrl: './voting.component.html',
  styleUrl: './voting.component.scss',
  imports: [CardComponent, CommonModule, FontAwesomeModule],
})
export class VotingComponent implements OnInit {
  images: ImageCardResponse[] = [];
  faSpinner = faSpinner;
  constructor(private allStarService: AllStarService) {
    this.vote = this.vote.bind(this);
  }

  ngOnInit(): void {
    this.setup();
  }

  async setup() {
    this.images = await this.allStarService.getImageRandom();
  }

  async vote(image: ImageResponse) {
    this.images = [];
    // delay for 1 second before setup
    setTimeout(() => {
      this.setup();
    }, 500);
  }
}
