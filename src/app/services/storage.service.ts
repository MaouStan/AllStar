import { Injectable } from '@angular/core';
import { AllStarService } from './api/allstar.service';
import { UserRes } from '../models/user-res';

const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private allStarService: AllStarService) {}

  clean(): void {
    window.sessionStorage.clear();
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }

  public async isLoggedInFull(): Promise<boolean> {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      const userDb: UserRes[] = await this.allStarService.getUserByUsername(
        JSON.parse(user).username
      );
      const firstUser: UserRes = userDb[0];

      // check all value same
      if (
        firstUser.username === JSON.parse(user).username &&
        firstUser.password === JSON.parse(user).password &&
        firstUser.userId === JSON.parse(user).userId &&
        firstUser.type === JSON.parse(user).type
      ) {
        return true;
      }
    }

    return false;
  }

  public isLoggedIn(): boolean {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return true;
    }
    return false;
  }
}
