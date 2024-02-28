import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements CanActivate {
  constructor(private storageService: StorageService) {}

  async canActivate(): Promise<boolean> {
    let isLoggedIn = this.storageService.isLoggedIn();
    const path = window.location.pathname;
    // Define routes for redirection
    const pathRequireLogged = ['/join', '/signin', '/signup'];
    const pathNotLoggedToRedirect = [
      '/change',
      '/edit1',
      '/profile',
      '/graph',
      '/search',
    ];

    if (isLoggedIn && pathRequireLogged.includes(path)) {
      // User is logged in and trying to access a login-required route
      window.location.href = '/';
      return false;
    } else if (pathNotLoggedToRedirect.includes(path)) {
      // User is not logged in and trying to access a logged-in required route
      isLoggedIn = await this.storageService.isLoggedInFull();
      if (!isLoggedIn) {
        window.location.href = '/join';
        return false;
      }
    }

    return true;
  }
}
