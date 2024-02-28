import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements CanActivate {
  constructor(private storageService: StorageService) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    let isLoggedIn = this.storageService.isLoggedIn();
    const path = state.url; // Use the URL from the RouterStateSnapshot
    // Define routes for redirection
    const pathRequireLogged = ['/join', '/signin', '/signup'];
    const pathNotLoggedToRedirect = [
      '/change',
      '/edit1',
      '/profile',
      '/chart',
      '/search',
    ];

    const pathToCheckFull = ['/change', '/upload', '/edit1'];

    if (isLoggedIn && pathRequireLogged.includes(path)) {
      // User is logged in and trying to access a login-required route
      window.location.href = '/';
      return false;
    } else if (pathNotLoggedToRedirect.includes(path)) {
      // User is not logged in and trying to access a logged-in required route
      if (pathToCheckFull.includes(path)) {
        isLoggedIn = await this.storageService.isLoggedInFull();
      }

      if (!isLoggedIn) {
        window.location.href = '/join';
        return false;
      }
    }

    return true;
  }
}
