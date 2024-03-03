import { expressjwt, Request as JWTRequest } from 'express-jwt';
import dotenv from 'dotenv';

// App Variables
dotenv.config();

// AUTH JWT
export const jwtAuthen = expressjwt({
  algorithms: ['HS256'],
  secret: process.env.ACCESS_TOKEN_PUBLIC_KEY!,
}).unless({
  path: [
    '/',
    '/api/auth/register',
    '/api/auth/login',
    '/api/image/ranks',
    '/api/image/random',
    '/api/vote',
    '/api/upload',
  ],
});
