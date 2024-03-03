import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { NavbarComponent } from "./components/navbar/navbar.component";
import "toastify-js/src/toastify.css"
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterModule, NavbarComponent,CommonModule]
})
export class AppComponent {
  title = 'AllStar';

  constructor(private authService: AuthService, private router: Router) { }

  isAdmin = false;

  ngOnInit() {
    // check if admin
    this.isAdmin = this.authService.isAdmin();

    if (this.isAdmin) {
      // check path only /admin/* another path will redirect to /admin
      if (!this.router.url.includes('admin')) {
        this.router.navigate(['/admin/dashboard']);
      }
    }
  }
}
