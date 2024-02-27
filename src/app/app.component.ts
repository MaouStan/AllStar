import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { StorageService } from './services/storage.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [NavbarComponent, RouterModule],
})
export class AppComponent {
  title = 'AllStar';

  constructor(private router: Router, private storageService: StorageService) {}

  ngOnInit() {
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe(async (event: unknown) => {
        const isLoggedIn = await this.storageService.isLoggedIn();
        const path = (event as NavigationEnd).urlAfterRedirects;

        // Define routes for redirection
        const pathLoggedToRedirect = ['/join', '/signin', '/signup', '/edit'];
        const pathNotLoggedToRedirect = [
          '/change-password',
          '/edit',
          '/profile',
          '/graph',
          '/search',
        ];

        if (isLoggedIn && pathLoggedToRedirect.includes(path)) {
          // User is logged in and trying to access a login-required route
          this.router.navigate(['/']);
        } else if (!isLoggedIn && pathNotLoggedToRedirect.includes(path)) {
          // User is not logged in and trying to access a logged-in required route
          this.router.navigate(['/join']);
        }
      });
  }
}
