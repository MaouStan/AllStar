import { Component, OnInit } from '@angular/core';
import { AllStarService } from '../../services/api/allstar.service';
import { ImageResponse } from '../../models/image-res';
import { CardComponent } from '../../components/card/card.component';
import { CommonModule } from '@angular/common';
import { ImageCardResponse } from '../../models/image-card-res';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import Elo from '@studimax/elo';
import { UserRes } from '../../models/user-res';
import { StorageService } from '../../services/storage.service';

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
  user: UserRes | null = this.storageService.getUser();
  constructor(
    private allStarService: AllStarService,
    private storageService: StorageService
  ) {
    this.vote = this.vote.bind(this);
  }

  ngOnInit(): void {
    this.setup();
  }

  async setup() {
    this.images = await this.allStarService.getImageRandom();
  }

  async vote(image: ImageResponse) {
    // get winner is image
    const winner = this.images.find((i) => i.id === image.id)!;
    const loser = this.images.find((i) => i.id !== image.id)!;
    this.images = [];

    // calc elo system
    const elo = new Elo({ kFactor: 20 });
    let { Ra, Rb } = elo.calculateRating(winner.score, loser.score, 1); // 1 = win
    // cast to int
    Ra = Math.round(Ra);
    Rb = Math.round(Rb);
    winner.score = Ra;
    loser.score = Rb;

    // insert voting record
    await this.allStarService.vote(
      this.user?.userId ?? null,
      winner,
      loser
    );

    // delay for 1 second before setup
    setTimeout(() => {
      this.setup();
    }, 500);
  }
}
