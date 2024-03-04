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

    const resp: APIResponse | undefined = await this.http.get<APIResponse>(this.constants.API_ENDPOINT + '/image/random' + query).toPromise();
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

    let resp: APIResponse | undefined = await this.http.get<APIResponse>(this.constants.API_ENDPOINT + `/user/${userId}/stats`, { headers: headers }).toPromise();
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

  async uploadImage(file: File): Promise<APIResponse> {
    const formData = new FormData();
    formData.append('file', file);
    let resp = await lastValueFrom(this.http.post(this.constants.API_ENDPOINT + '/upload', formData));

    return resp as APIResponse
  }

  async create(imageUploadRequest: ImageUploadRequest) {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    // jwt auth header
    const headers = { 'Authorization': `Bearer ${token}` }

    await this.http.post<APIResponse>(this.constants.API_ENDPOINT + '/image', imageUploadRequest, { headers: headers }).subscribe(
      (data) => {
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
      },
      (error) => {
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
    )
  }
}
