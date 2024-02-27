import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowDown, faCloudArrowDown } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [MatButtonModule, FontAwesomeModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignUpComponent {
  faArrowDown = faArrowDown;
  faCloudArrowDown = faCloudArrowDown;
}
