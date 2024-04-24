import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
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

//google login
const provider = new GoogleAuthProvider();
const googleLogin = document.getElementById("google-login");
googleLogin.addEventListener('click', function () {
    signInWithPopup(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const user = result.user;
            const tokenID = user.getIdToken();
            localStorage.setItem('tokenID', tokenID);
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(error.code);
        });
});

//email password login
const loginForm = document.getElementById("loginForm");
loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = loginForm['email'].value;
    const password = loginForm['password'].value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const tokenID = user.getIdToken();
            localStorage.setItem('tokenID', tokenID);
            //console.log('Logged in successfully:', tokenID);
            //console.log('Logged in successfully:', JSON.stringify(user));
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('login error:', errorCode, errorMessage);
            alert("Email or password is incorrect. Please try again !")
        });
});

//create account
function createUserReq(userData) {
    var requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    };

    return requestOptions;
}

function createUser(userData) {
    var requestOptions = createUserReq(userData);
    console.log(requestOptions);
    fetch('/create-user', requestOptions)
        .then(response => response.json())
        .then(data => {
            console.log('Response from server:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

const signUpForm = document.getElementById("signUpForm");
signUpForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = signUpForm['name'].value;
    const email = signUpForm['email'].value;
    const password = signUpForm['password'].value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            createUser(user);
            alert("Sign up success !");
            signUpForm.reset();
            document.getElementById("login").click();
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('sign up error:', errorCode, errorMessage);
            alert("Email has been used. Please try again !")
        });
});