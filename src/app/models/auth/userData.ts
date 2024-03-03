export interface UserData {
  userId: string,
  username: string,
  image: string,
  type: "admin" | "user",
  iat: number,
  exp: number
}