"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const app_1 = require("firebase/app");
const dotenv_1 = __importDefault(require("dotenv"));
// App Variables
dotenv_1.default.config();
// firebaseConfig
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "anime-allstar.firebaseapp.com",
    projectId: "anime-allstar",
    storageBucket: "anime-allstar.appspot.com",
    messagingSenderId: "217305712714",
    appId: "1:217305712714:web:4cb0c5c53c2a93fc3e7eb3",
    measurementId: "G-8PMXEE8ZYZ"
};
// Initialize Firebase
exports.app = (0, app_1.initializeApp)(firebaseConfig);
