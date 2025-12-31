import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBnMkPBwuQKO_9zOXbdiXaUpgCnpGF0sbs",
  authDomain: "smart-attendance-gcp-482318.firebaseapp.com",
  projectId: "smart-attendance-gcp-482318",
  appId: "1:94166240950:web:5f7ac05bcb990f6983e017"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
