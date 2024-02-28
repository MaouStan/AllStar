import { Injectable } from '@angular/core';
import { CanActivate, CanDeactivate } from '@angular/router';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements CanActivate {
  constructor(private storageService: StorageService) {}

  async canActivate(): Promise<boolean> {
    const isLoggedIn = await this.storageService.isLoggedInFull();
    const path = window.location.pathname;
    console.log(isLoggedIn, path);
    // Define routes for redirection
    const pathLoggedToRedirect = ['join', 'signin', 'signup'];
    const pathNotLoggedToRedirect = [
      'change-password',
      'edit1',
      'profile',
      'graph',
      'search',
    ];

    if (isLoggedIn && pathLoggedToRedirect.includes(path)) {
      // User is logged in and trying to access a login-required route
      // window.location.href = '/';
      console.log(1);
    } else if (isLoggedIn == false && pathNotLoggedToRedirect.includes(path)) {
      // User is not logged in and trying to access a logged-in required route
      // window.location.href = '/join';
      console.log(2);
    }
    console.log(3);

    return true;
  }
}
