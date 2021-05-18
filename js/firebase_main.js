var firebaseConfig = {
  apiKey: "AIzaSyDMQiTw2fG5df-MSJr2yKK5tUzhwW-tw1I",
  authDomain: "testorg-b2e5f.firebaseapp.com",
  projectId: "testorg-b2e5f",
  storageBucket: "testorg-b2e5f.appspot.com",
  messagingSenderId: "879567495664",
  appId: "1:879567495664:web:0b74146beb8ed18a98bd35",
  measurementId: "G-BF21NQ4L8G",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const db = firebase.firestore();
const auth = firebase.auth();

