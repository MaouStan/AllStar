import { UserService } from './../../services/api/user.service';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { faEdit, faEllipsisV, faPlus, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UserData } from '../../models/api/userData';
import { ImageRank } from '../../models/api/image-ranks';
import { ImageService } from '../../services/api/image.service';
import { RankCardComponent } from "../../components/rank-card/rank-card.component";

@Component({
  selector: 'app-new-profile',
  standalone: true,
  templateUrl: './new-profile.component.html',
  styleUrl: './new-profile.component.scss',
  imports: [CommonModule, FontAwesomeModule, RankCardComponent, RouterModule]
})
export class NewProfileComponent implements OnInit {

  user!: UserData & { images?: ImageRank[] };
  userService = inject(UserService)
  imageService = inject(ImageService)
  activateRoute = inject(ActivatedRoute)
  faSpinner = faSpinner;
  faPlus = faPlus;
  faEdit = faEdit;
  faTrash = faTrash;

  async ngOnInit(): Promise<void> {
    // get user id from /:userId
    const userId = this.activateRoute.snapshot.params['userId'] || null;

    // get user data
    this.user = await this.userService.getUserById(userId);

    // get user's images
    this.user.images = await this.imageService.getUserImages(userId);
  }
}
