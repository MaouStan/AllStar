import { lastValueFrom } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { AdminUsers } from '../../models/admin/user';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../config/constants';
import { APIResponse } from '../../models/api-res';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  http: HttpClient = inject(HttpClient);
  constants: Constants = inject(Constants)
  constructor() { }

  // GET /api/user
  async getUsers(): Promise<AdminUsers[]> {
    const resp: APIResponse = await lastValueFrom(this.http.get(this.constants.API_ENDPOINT + '/user')) as APIResponse;
    if (resp) {
      return resp.data as AdminUsers[]; // Assuming the response data is an array
    }

    return [];
  }
}
