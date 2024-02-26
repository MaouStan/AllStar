import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { Card1Component } from "../../components/card-1/card-1.component";

@Component({
    selector: 'app-voting',
    standalone: true,
    templateUrl: './voting.component.html',
    styleUrl: './voting.component.scss',
    imports: [NavbarComponent, Card1Component]
})
export class VotingComponent {

}
