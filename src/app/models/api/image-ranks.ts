export interface ImageRank {
  id:             number;
  userId:         number;
  imageURL:       string;
  score:          number;
  name:           string;
  series_name:    string;
  description:    null;
  last_update:    string;
  currentScore:   number;
  user_username:  string;
  user_image:     string;
  currentRank:    number;
  yesterdayRank:  number;
  yesterdayScore: number;
}
