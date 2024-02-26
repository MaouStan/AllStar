import { Component } from '@angular/core';
import { NavbarEditComponent } from '../../components/navbar-edit/navbar-edit.component';
import { Card1Component } from '../../components/card-1/card-1.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [NavbarEditComponent, Card1Component, MatButtonModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent {

}
