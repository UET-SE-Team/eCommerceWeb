import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
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

document.getElementById('adminIcon').addEventListener('click', async () => {
    const adminURL = `/admin`;
    window.location.href = adminURL;
});


async function getUserInfo(uid) {
    try {
        const response = await fetch('/user-info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ uid: uid })
        });
        const userInfo = await response.json();
        return userInfo;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

onAuthStateChanged(auth, async (user) => {
    let isAdmin = false;
    if (auth.currentUser) {
        const idToken = await auth.currentUser.getIdTokenResult(true);
        isAdmin = idToken.claims.admin === true;
        console.log('User is admin:', isAdmin);
        //console.log(JSON.stringify(auth.currentUser));
        const userInfo = await getUserInfo(auth.currentUser.uid);
        document.getElementById('userBtn').style.display = "none";
        document.getElementById('avatarBtn').style.display = "inline-block";
        document.querySelectorAll('.avatar').forEach(img => {
            img.src = userInfo.avatarLink;
        });
    } else {
        document.getElementById('avatarBtn').style.display = "none";
        document.getElementById('userBtn').style.display = "inline-block";
    }
    if (isAdmin) {
        document.getElementById('adminIcon').style.display = "inline-block";
    } else {
        document.getElementById('adminIcon').style.display = "none";
    }
    document.getElementById('cartIcon').style.display = "inline-block";
    document.getElementById('heartBtn').style.display = "inline-block";
    document.getElementById('searchBtn').style.display = "inline-block";
});

const cartBtn = document.getElementById('cartIcon')
cartBtn.addEventListener('click', function () {
    if (auth.currentUser) {
        body.classList.toggle('showCart');
    } else {
        document.getElementById('userBtn').click();
    }
});

const heartBtn = document.getElementById('heartBtn')
heartBtn.addEventListener('click', function () {
    if (!auth.currentUser) {
        document.getElementById('userBtn').click();
    }
});

//google login
const provider = new GoogleAuthProvider();
const googleLogin = document.getElementById("google-login");
googleLogin.addEventListener('click', function () {
    signInWithPopup(auth, provider)
        .then(async (result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const user = result.user;
            const tokenID = user.getIdToken();
            localStorage.setItem('tokenID', tokenID);
            //console.log('>>> tokenID:', tokenID);
            //console.log('>>> user:', JSON.stringify(user));
            const closeBtn = document.querySelector(".popup .close-btn");
            await sendRequest('/create-user', {
                uid: user.uid,
                firstName: user.displayName,
                lastName: null,
                email: user.email,
                phoneNumber: user.phoneNumber,
                avatarLink: '/images/avatar/default.jpg'
            });
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
        //console.log('Logged in successfully:', tokenID);
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
function createDataRequest(data) {
    var requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    return requestOptions;
}

function sendRequest(address, data) {
    var requestOptions = createDataRequest(data);
    console.log(requestOptions);
    console.log(address);
    fetch(address, requestOptions)
        .then(data => {
            console.log('Response from server:', data.body);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

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
            sendRequest('/create-user', {
                uid: user.uid,
                firstName: firstName,
                lastName: lastName,
                email: email,
                phoneNumber: phoneNumber,
                avatarLink: '/images/avatar/default.jpg'
            });
            alert("Sign up success !");
            signUpForm.reset();
            return auth.signOut();
        }).then(() => {
            document.getElementById("login").click();
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('sign up error:', errorCode, errorMessage);
            alert("Email has been used. Please try again !")
        });
});

const settingBtn = document.getElementById("settingBtn");
settingBtn.addEventListener('click', (event) => {
    const user = auth.currentUser;
    if (user) {
        fetch('/settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ uid: user.uid })
        }).then(response => {
        }).catch(error => {
            console.error('Error:', error);
        });
    } else {
        console.log("User is not logged in.");
    }
});

const logOutBtn = document.getElementById("logOutBtn");
logOutBtn.addEventListener('click', (event) => {
    event.preventDefault();
    auth.signOut().then(() => {
        console.log('user signed out');
        localStorage.removeItem('tokenID');
        window.location.href = "/";
    });
});

/*
// JavaScript code
document.addEventListener('DOMContentLoaded', function () {
    const saveButton = document.getElementById('saveButton');
    const fileInput = document.getElementById('input-file');
    let changesMade = false;

    // Kiểm tra xem có thông tin nào được thay đổi không
    const checkChanges = () => {
        const inputs = document.querySelectorAll('.form-control');
        for (const input of inputs) {
            if (input.value !== input.defaultValue) {
                changesMade = true;
                return;
            }
        }
        changesMade = false;
    };

    // Kích hoạt hoặc vô hiệu hóa nút "Save changes"
    const toggleSaveButton = () => {
        if (changesMade) {
            saveButton.removeAttribute('disabled');
        } else {
            saveButton.setAttribute('disabled', 'disabled');
        }
    };

    // Thêm sự kiện cho các trường nhập liệu để kiểm tra thay đổi
    const formInputs = document.querySelectorAll('.form-control');
    formInputs.forEach(input => {
        input.addEventListener('input', () => {
            checkChanges();
            toggleSaveButton();
        });
    });

    // Thêm sự kiện cho nút "Upload image" để lưu hình ảnh
    fileInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('avatar', file);
            try {
                const response = await fetch('/upload-avatar', {
                    method: 'POST',
                    body: formData
                });
                if (response.ok) {
                    const imagePath = await response.text();
                    console.log('Image uploaded successfully:', imagePath);
                    // Update image src attribute
                    const avatarImage = document.querySelector('.avatar');
                    avatarImage.src = imagePath;
                    // Cập nhật biến changesMade
                    changesMade = true;
                    toggleSaveButton();
                } else {
                    console.error('Failed to upload image');
                }
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
    });
});
    */

const addAdminForm = document.getElementById('addAdminForm');
addAdminForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    /*
    const email = document.getElementById('emailAdmin').value;

    try {
        const response = await fetch('/addAdminRole', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Server response:', data);
            if (data.success) {
                alert('Admin role added successfully!');
            } else {
                console.error('Error:', data.message); // Handle potential error message
                alert('Failed to add admin role. Please try again.');
            }
        } else {
            console.error('Error adding admin role:', response.status);
            alert('Failed to add admin role. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
    */
});

