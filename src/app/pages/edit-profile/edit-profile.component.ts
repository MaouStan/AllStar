import { Component } from '@angular/core';
import { NavbarEditComponent } from '../../components/navbar-edit/navbar-edit.component';
import { Card1Component } from '../../components/card-1/card-1.component';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [NavbarEditComponent, Card1Component, MatButtonModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent {

}
