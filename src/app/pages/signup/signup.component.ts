import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowDown,
  faCloudArrowDown,
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';
import { UserNewReq } from '../../models/user-new-req';
import { UserNewRes } from '../../models/user-new-res';
import { AllStarService } from '../../services/api/allstar.service';
import { UserRes } from '../../models/user-res';
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [MatButtonModule, CommonModule, FontAwesomeModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignUpComponent {
  constructor(private allStarService: AllStarService) {}

  faArrowDown = faArrowDown;
  faCloudArrowDown = faCloudArrowDown;
  eye1: typeof faEye | typeof faEyeSlash = faEye;
  eye2: typeof faEye | typeof faEyeSlash = faEye;
  image: string | ArrayBuffer | null = null;
  imageFile: File | null = null;

  togglePasswordVisibility(input: HTMLInputElement, eye: number) {
    input.type = input.type === 'password' ? 'text' : 'password';
    if (eye === 1) {
      this.eye1 = input.type === 'password' ? faEye : faEyeSlash;
    } else {
      this.eye2 = input.type === 'password' ? faEye : faEyeSlash;
    }
  }

  handleFileInput($event: Event) {
    // file uploaded image to be displayed
    const file = ($event.target as HTMLInputElement).files![0];
    const reader = new FileReader();
    reader.onload = () => {
      this.image = reader.result;
    };
    reader.readAsDataURL(file);
    this.imageFile = file;
  }

  async signUp($event: Event) {
    // handle form submission
    $event.preventDefault();

    // if image is not uploaded
    if (!this.imageFile) {
      alert('Please upload an image');
      return;
    }

    // check password match confirmPassword
    const form = $event.target as HTMLFormElement;
    if (form['password'].value !== form['confirmPassword'].value) {
      alert('Password and Confirm Password do not match');
    }

    // check username already
    const userRes: UserRes[] = await this.allStarService.getUserByUsername(
      form['username'].value
    );

    if (userRes.length > 0) {
      alert('Username already exists');
      return;
    }

    // call allStarService.upload imageFile
    const formData = new FormData();
    formData.append('file', this.imageFile);
    const uploadResponse = await this.allStarService.upload(formData);

    let imageURL = uploadResponse.filename;
    if (!imageURL) {
      alert('Image upload failed');
      return;
    }

    // call allStarService.createUser jsonData
    const data: UserNewReq = {
      username: form['username'].value,
      password: form['password'].value,
      imageURL: imageURL,
    };

    // call services
    const createUserResponse: UserNewRes = await this.allStarService.createUser(
      data
    );

    // if createUserResponse.id is not undefined
    if (createUserResponse.id) {
      // goto /signin
      window.location.href = '/signin';
    } else {
      alert(createUserResponse.message);
    }
  }
}
