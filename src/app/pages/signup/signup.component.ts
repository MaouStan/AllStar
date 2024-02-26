import { Component } from '@angular/core';
import { NavbarEditComponent } from '../../components/navbar-edit/navbar-edit.component';
import { Card1Component } from '../../components/card-1/card-1.component';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [NavbarEditComponent, Card1Component, MatButtonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

}
