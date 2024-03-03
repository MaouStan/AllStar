export interface ImageStatResponse {
  id: number;
  userId: number;
  imageURL: string;
  scores: number[];
  name: string;
  series_name: string;
}
