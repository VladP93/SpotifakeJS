import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDzWFkfPPRdc9m2G-vQU4riHCJIkfa2Nj4",
  authDomain: "spotifakejs.firebaseapp.com",
  databaseURL: "https://spotifakejs.firebaseio.com",
  projectId: "spotifakejs",
  storageBucket: "spotifakejs.appspot.com",
  messagingSenderId: "417924520969",
  appId: "1:417924520969:web:55d3b22b44057895b62cd8",
};

export default firebase.initializeApp(firebaseConfig);
