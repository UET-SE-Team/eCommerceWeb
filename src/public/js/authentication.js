import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
//import { auth } from "https://www.gstatic.com/firebasejs/10.11.0/firebase.js";

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

const token = localStorage.getItem('tokenID');
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('userBtn').style.display = "none";
        document.getElementById('avatarBtn').style.display = "inline-block";
        cartIcon.addEventListener('click', function () {
            body.classList.toggle('showCart');
        });
    } else {
        document.getElementById('avatarBtn').style.display = "none";
        document.getElementById('userBtn').style.display = "inline-block";
        document.getElementById('cartIcon').addEventListener('click', function () {
            document.getElementById('userBtn').click();
        });
        document.getElementById('heartBtn').addEventListener('click', function () {
            document.getElementById('userBtn').click();
        });
    }
    document.getElementById('cartIcon').style.display = "inline-block";
    document.getElementById('heartBtn').style.display = "inline-block";
    document.getElementById('searchBtn').style.display = "inline-block";
});

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
            const closeBtn = document.querySelector(".popup .close-btn");
            closeBtn.click();
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(error.code);
        });
});

//email password login
const loginForm = document.getElementById("loginForm");
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = loginForm['email'].value;
    const password = loginForm['password'].value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const tokenID = await user.getIdToken();
        localStorage.setItem('tokenID', tokenID);
        console.log('Logged in successfully:', tokenID);
        const closeBtn = document.querySelector(".popup .close-btn");
        closeBtn.click();
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('login error:', errorCode, errorMessage);
        alert("Email or password is incorrect. Please try again !");
    }
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

const logOutBtn = document.getElementById("logOutBtn");
logOutBtn.addEventListener('click', (event) => {
    event.preventDefault();
    auth.signOut().then(() => {
        console.log('user signed out');
        localStorage.removeItem('tokenID');
        window.location.href = "/";
    });
});

const signUpForm = document.getElementById("signUpForm");
signUpForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const firstName = signUpForm['firstName'].value;
    const lastName = signUpForm['lastName'].value;
    const phoneNumber = signUpForm['phoneNumber'].value;
    const email = signUpForm['email'].value;
    const password = signUpForm['password'].value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            createUser({
                uid: user.uid,
                firstName: firstName,
                lastName: lastName,
                email: email,
                phoneNumber: phoneNumber,
            });
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