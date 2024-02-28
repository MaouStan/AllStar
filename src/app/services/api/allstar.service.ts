import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '../../config/constants';
import { lastValueFrom } from 'rxjs';
import { UploadRes } from '../../models/upload-res';
import { UserNewReq } from '../../models/user-new-req';
import { UserNewRes } from '../../models/user-new-res';
import { UserRes } from '../../models/user-res';
import * as bcrypt from 'bcryptjs';
import { imageUploadRequest } from '../../models/image-upload-req';
import { PostApiResponse } from '../../models/post-api-res';
import { ImageResponse } from '../../models/image-res';

@Injectable({
  providedIn: 'root',
})
export class AllStarService {
  constructor(private constants: Constants, private http: HttpClient) {}

  // upload
  async upload(formData: FormData) {
    let response = await lastValueFrom(
      this.http.post(
        `${this.constants.API_ENDPOINT}/upload?apikey=${this.constants.API_KEY}`,
        formData
      )
    );

    return response as UploadRes;
  }

  // createUser
  async createUser(user: UserNewReq) {
    const data: UserNewReq = {
      username: user.username,
      password: user.password,
      imageURL: user.imageURL,
    };

    // hash password
    async function hashPassword(password: string): Promise<string> {
      const hashedPassword = await bcrypt.hashSync(password, 10);
      return hashedPassword;
    }

    data.password = await hashPassword(data.password);

    console.log(data);

    const response = await lastValueFrom(
      this.http.post(
        `${this.constants.API_ENDPOINT}/user?apikey=${this.constants.API_KEY}`,
        data
      )
    );

    return response as UserNewRes;
  }

  // getUserById(id)
  async getUserById(id: number) {
    const response = await lastValueFrom(
      this.http.get(
        `${this.constants.API_ENDPOINT}/user/${id}?apikey=${this.constants.API_KEY}`
      )
    );

    return response as UserRes;
  }

  // getUserByUserName
  async getUserByUsername(username: string) {
    const response = await lastValueFrom(
      this.http.get(
        `${this.constants.API_ENDPOINT}/user?username=${username}&apikey=${this.constants.API_KEY}`
      )
    );

    return response as UserRes[];
  }

  // createPost
  async createPost(imageUploadRequest: imageUploadRequest) {
    const response = await lastValueFrom(
      this.http.post(
        `${this.constants.API_ENDPOINT}/image?apikey=${this.constants.API_KEY}`,
        imageUploadRequest
      )
    );

    return response as PostApiResponse;
  }

  // getImagesFromUser
  async getImagesFromUser(userId: number) {
    const response = await lastValueFrom(
      this.http.get(
        `${this.constants.API_ENDPOINT}/image/user/${userId}?apikey=${this.constants.API_KEY}`
      )
    );

    return response as ImageResponse[];
  }
}
