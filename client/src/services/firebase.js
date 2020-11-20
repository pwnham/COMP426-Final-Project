import firebase from "firebase";

const config = {
  apiKey: "AIzaSyAJAMNjNtajlQlvDjY9ppdCw_fnyzevE3o",
  authDomain: "fridgeshare-93143.firebaseapp.com",
  databaseURL: "https://fridgeshare-93143.firebaseio.com",
};
firebase.initializeApp(config);
export const auth = firebase.auth;
export const db = firebase.database();
