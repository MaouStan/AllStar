export interface ImageCardResponse {
  id: number;
  userId: number;
  username: string;
  userImage: string;
  imageURL: string;
  score: number;
  name: string;
  series_name: string;
  description: string | null;
}
