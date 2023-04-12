import firebase, { initializeApp } from "firebase/app";
import { Auth, getAuth, RecaptchaVerifier } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDtyC0O8TweQKlpJp4k0LmHvWMQ02ib8aU",
    authDomain: "bonokey-75f66.firebaseapp.com",
    projectId: "bonokey-75f66",
};

let app: firebase.FirebaseApp;
let firebaseAuth: Auth;
let firestore: Firestore;
let firebaseCaptcha: RecaptchaVerifier;

try {
    app = initializeApp(firebaseConfig);
    firebaseAuth = getAuth(app);
    firestore = getFirestore(app);

    firebaseCaptcha = new RecaptchaVerifier(
        "recaptcha-container",
        {
            size: "invisible",
            callback: () => {
                // This will be called when the reCAPTCHA widget is completed
            },
        },
        firebaseAuth
    );
} catch (error: any) {
    if (!/already exists/.test(error.message)) {
        console.log("Firebase initialization failed: ", error.stack);
    }
} // try catch

export { firebaseAuth, firestore, firebaseCaptcha };
export default firebase;
