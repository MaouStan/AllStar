import { Component } from '@angular/core';
import { NavbarEditComponent } from '../../components/navbar-edit/navbar-edit.component';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent {

}
