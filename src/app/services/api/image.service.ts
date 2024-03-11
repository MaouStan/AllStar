import { Injectable, inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../config/constants';
import { lastValueFrom } from 'rxjs';
import { CardData } from '../../models/card-data';
import { APIResponse } from '../../models/api-res';
import { ImageStatResponse } from '../../models/api/image-stats';
import { ImageUploadRequest } from '../../models/api/image-upload-req';
import Toastify from 'toastify-js';
import { ImageRank } from '../../models/api/image-ranks';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  authService: AuthService = inject(AuthService);
  http: HttpClient = inject(HttpClient);
  constants: Constants = inject(Constants)

  async getImageRandom() {
    let query = '?';
    if (this.authService.loggedIn()) {
      const user = this.authService.getCurrentUserData(false);
      query += 'userId=' + user?.userId;
    }
    else {
      // save machine code
      query += 'browserId=' + this.authService.getMachineCode();
    }

    const resp: APIResponse | undefined = await lastValueFrom(this.http.get<APIResponse>(this.constants.API_ENDPOINT + '/image/random' + query));
    if (resp?.status === 'ok') {
      const data = resp.data as CardData[]
      return data;
    }
    return [];
  }

  async getImagesStats(userId: number) {
    // get token
    const token = localStorage.getItem("token");
    if (!token) {
      return [];
    }

    // jwt auth header
    const headers = { 'Authorization': `Bearer ${token}` };

    let resp: APIResponse | undefined = await lastValueFrom(this.http.get<APIResponse>(this.constants.API_ENDPOINT + `/user/${userId}/stats`, { headers: headers }));
    if (resp?.status === 'ok') {
      resp.data = (resp.data as any[]).map((res: any) => {
        let scores: string[] | number[] = res.scores.split(',');
        // cast foreach to number
        scores.forEach((score, index) => {
          scores[index] = +score;
        });
        return {
          ...res,
          scores: scores,
        };
      });

      return resp.data as ImageStatResponse[];
    }
    return [];
  }

  async create(imageUploadRequest: FormData) {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    // jwt auth header
    const headers = { 'Authorization': `Bearer ${token}` }

    try {
      const resp: APIResponse = await lastValueFrom(this.http.post<APIResponse>(this.constants.API_ENDPOINT + '/image', imageUploadRequest, { headers: headers }));

      // toast
      Toastify({
        text: "Image uploaded successfully",
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
      }).showToast();
    } catch (error: any) {
      const resp: APIResponse = error.error as APIResponse;
      // toast
      Toastify({
        text: "Image upload failed",
        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
      }).showToast();
      Toastify({
        text: resp.message,
        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
      }).showToast();
    }
  }

  async getTop10() {
    let resp: APIResponse | undefined = await lastValueFrom(this.http.get<APIResponse>(this.constants.API_ENDPOINT + '/image/top10'));
    if (resp?.status === 'ok') {
      const data = resp.data as ImageRank[];
      return data;
    }
    return [];
  }

  // get ranks /image/ranks
  async getRanks() {
    let resp: APIResponse | undefined = await lastValueFrom(this.http.get<APIResponse>(this.constants.API_ENDPOINT + '/image/ranks'));
    if (resp?.status === 'ok') {
      const data = resp.data as ImageRank[];
      return data;
    }
    return [];
  }
}
