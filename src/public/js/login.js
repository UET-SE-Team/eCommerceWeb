import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
const firebaseConfig = {
    apiKey: "AIzaSyBo0gDdJUG5SeZcEbwMC7xo9ZeetHrwcTM",
    authDomain: "my-second-project-bbebd.firebaseapp.com",
    projectId: "my-second-project-bbebd",
    storageBucket: "my-second-project-bbebd.appspot.com",
    messagingSenderId: "133094907854",
    appId: "1:133094907854:web:2c83532de770e2656f159f",
    measurementId: "G-RSY8Z1DSZQ"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = "en";
const provider = new GoogleAuthProvider();
const googleLogin = document.getElementById("google-login");
googleLogin.addEventListener('click', function () {
    signInWithPopup(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const user = result.user;
            //window.location.href = ""
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(error.code);
        });
});