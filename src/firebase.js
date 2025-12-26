import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCeGidFJ0SUsY1DdKuWY3uzxhrfDaOc_Yk",
  authDomain: "netflix-clone-32c7a.firebaseapp.com",
  projectId: "netflix-clone-32c7a",
  storageBucket: "netflix-clone-32c7a.firebasestorage.app",
  messagingSenderId: "88073492339",
  appId: "1:88073492339:web:fe963c4a0f65ef55ec1706",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const dp = firebaseApp.firestore();
const auth = firebase.auth();

export { auth };
export default dp;
