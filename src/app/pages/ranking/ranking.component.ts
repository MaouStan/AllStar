import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Card1Component } from '../../components/card-1/card-1.component';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [NavbarComponent, Card1Component, ],
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.scss',
})
export class RankingComponent {}
