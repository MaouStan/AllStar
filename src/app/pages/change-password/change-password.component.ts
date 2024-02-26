import { Component } from '@angular/core';
import { NavbarEditComponent } from '../../components/navbar-edit/navbar-edit.component';
import { Card1Component } from '../../components/card-1/card-1.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [NavbarEditComponent, Card1Component, MatButtonModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent {}
