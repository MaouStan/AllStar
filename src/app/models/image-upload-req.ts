export interface imageUploadRequest {
  userId: number;
  imageURL: string;
  name: string;
  series_name: string;
  description: string | null;
}
