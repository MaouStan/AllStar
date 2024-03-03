export interface ImageResponse {
  id: number;
  userId: number;
  imageURL: string;
  score: number;
  name: string;
  series_name: string;
  description: string | null;
}
