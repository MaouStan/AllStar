import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowDown,
  faCloudArrowDown,
} from '@fortawesome/free-solid-svg-icons';
import { AllStarService } from '../../services/api/allstar.service';
import { imageUploadRequest } from '../../models/image-upload-req';
import { StorageService } from '../../services/storage.service';
import { UserRes } from '../../models/user-res';
import { ImageResponse } from '../../models/image-res';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [MatButtonModule, FontAwesomeModule, RouterModule, CommonModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss',
})
export class UploadComponent implements OnInit {
  user: UserRes = this.storageService.getUser();

  constructor(
    private allStarService: AllStarService,
    private storageService: StorageService
  ) {}
  ngOnInit(): void {
    this.setUp();
  }

  async setUp() {
    const images: ImageResponse[] = await this.allStarService.getImagesFromUser(
      this.user.userId
    );

    // if len > 5 redirect home
    if (images.length >= 5) {
      alert('You have reached the maximum limit of 5 posts');
      window.location.href = '/';
    }
  }

  faArrowDown = faArrowDown;
  faCloudArrowDown = faCloudArrowDown;
  image: string | ArrayBuffer | null = null;
  imageFile: File | null = null;
  async upload($event: SubmitEvent) {
    // handle form submission
    $event.preventDefault();

    // if image is not uploaded
    if (!this.imageFile) {
      alert('Please upload an image');
      return;
    }

    const form = $event.target as HTMLFormElement;
    form['disabled'] = true;

    // call allStarService.upload imageFile
    const formData = new FormData();
    formData.append('file', this.imageFile);
    const uploadResponse = await this.allStarService.upload(formData);

    let imageURL = uploadResponse.filename;
    if (!imageURL) {
      alert('Image upload failed');
      return;
    }

    const user: UserRes = this.storageService.getUser();
    const imageUploadData: imageUploadRequest = {
      userId: user.userId,
      imageURL: imageURL,
      name: form['imageName'].value.trim(),
      series_name: form['seriesName'].value.trim(),
      description:
        form['description'].value.trim() === ''
          ? null
          : form['description'].value.trim(),
    };

    // call allStarService.createPost jsonData
    const response = await this.allStarService.createPost(imageUploadData);
    if (response.affectedRows !== 0) {
      alert('Post successfully');
      form.reset();
      this.image = null;
      this.imageFile = null;
    } else {
      alert('Post failed');
    }
  }
  handleFileInput($event: Event) {
    // file uploaded image to be displayed
    const file = ($event.target as HTMLInputElement).files![0];

    // Check file size
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      alert('File size exceeds the maximum limit of 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.image = reader.result;
    };
    reader.readAsDataURL(file);
    this.imageFile = file;
  }
}
