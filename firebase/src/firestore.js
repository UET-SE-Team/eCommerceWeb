import { initializeApp } from "firebase/app"
import { getFirestore } from 'firebase/firestore'
import { collection, setDoc, getDoc, getDocs, doc, deleteDoc, query, limit } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyBwcpRO543jCpAhq6_LxiLci3WeD2R13qM",
    authDomain: "ecommerceweb-b9cc4.firebaseapp.com",
    databaseURL: "https://ecommerceweb-b9cc4-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "ecommerceweb-b9cc4",
    storageBucket: "ecommerceweb-b9cc4.appspot.com",
    messagingSenderId: "643640209099",
    appId: "1:643640209099:web:cae3ec184cb1b73b28b54e",
    measurementId: "G-CNG9B4SGQE"
};

class User {
    constructor(name, gender, birth, email, phone_number, address) {
        this.name = name;
        this.birth = birth;
        this.gender = gender;
        this.email = email;
        this.phone_number = phone_number;
        this.address = address;
    }
}
class Account{
    constructor(account_name, account_pw, account_user_id) {
        this.name = account_name;
        this.password = account_pw;
        this.user_id = account_user_id;
    }
}

class Product{
    constructor(id, name, price, description) {
        this.id = id
        this.name = name;
        this.price = price;
        this.description = description;
    }
}

const app = initializeApp(firebaseConfig)

const db = getFirestore();

async function addAccount(account, user) {
    try{
        const accRef = doc(db, "Account", account.name);
        await setDoc(accRef, {
            password: account.password,
            account_userID: account.user_id
        });
        console.log("Account added")
        user.id = account.user_id;
        await addUser(user);
    } catch (error) {
        console.error("Error: " + error)
    }
}

async function getUserPassword(account_name) {
    try {
        const accountRef = doc(db, "Account", account_name);
        const userDoc = await getDoc(accountRef);
        if(!userDoc.exists()) {
            console.log('No such user document!');
            return null;
        }
        const userData = userDoc.data();
        return userData.password;
    } catch (error) {
        console.log("Error", error);
        return null;
    }
}

async function addUser(user) {
    try {
        const userRef = doc(db, "Users", user.id.toString())
        await setDoc(userRef, {
            name: user.name,
            birth: user.birth,
            gender: user.gender,
            email: user.email,
            phone_number: user.phone_number,
            address: user.address,
        });
        console.log("User added")
    } catch(e) {
        console.error("Error: " + e);
    }
}
async function addProduct(product) {
    try {
        const productRef = doc(db, "Products", product.id.toString());
        await setDoc(productRef, {
            name: product.name,
            description: product.description,
            price: product.price
        })
        console.log(`Product ${product.id} added`)
    } catch(error) {
        console.log(error);
    }
}

async function addProductToUserCart(userid, product) {
    try{
        const userRef = doc(db, "Users", userid.toString());
        const cartRef = doc(userRef, "carts", product.id.toString() );
        await setDoc(cartRef, {
            name: product.name,
            description: product.description,
            price: product.price
        });
        console.log("Added product " + product.name + " to user " + userid);
    } catch (error) {
        console.log("Error:", error);
    }
}

//if limit <= 0 then get all
async function getProducts(limitAmount) {
    const productRef = collection(db, "Products")
    if(limitAmount <= 0) {
        const querySnapshot = await getDocs(productRef);
        if(!querySnapshot.empty) {
            return querySnapshot;
        } else {
            return null;
        }
    } else {
        const queryLimit = query(productRef, limit(limitAmount));
        const querySnapshot = await getDocs(queryLimit);
        if(querySnapshot.empty) {
            return null;
        } else {
            return querySnapshot;
        }
    }
}
async function getALlProductsFromUserCart(userID) {
    try{
        const userRef = doc(db, "Users", userID.toString());
        const cartRef = collection(userRef, "carts");
        const querySnapshot = await getDocs(cartRef);
        if(!querySnapshot.empty) {
            return querySnapshot;
        } else {
            return null;
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function deleteProductFromUserCart(userID, productID) {
    try{
        const useRef = doc(db, "Users", userID.toString());
        const productRef = doc(useRef, "carts", productID.toString())
        await deleteDoc(productRef);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

// MAIN CODE GOES HERE

//let u = new User("Dinh CHi Kien", "Nam", "12-11-2004", "kien@gmail.com", "0948196267", "Ha Noi boi");
//let a = new Account("kien1211", "123123", 2)
//await addAccount(a,u);

//let result = await getUserPassword("kien1211");
//console.log(result)

//let p = new Product(2, 'Laptop Asus', 16000000, "500fps, 500hz, card do hoa 3090TI, pin 5000mA");
//await addProduct(p)
//await addProductToUserCart(1,p);

/*
let products_in_cart = await getALlProductsFromUserCart(1);
if(products_in_cart == null) {
    console.log("No product in cart")
} else {
    products_in_cart.forEach(e => {
        const p = e.data();
        console.log(p.name + "-" + p.description + "-" + p.price)
    })
}
*/

//let result = await deleteProductFromUserCart(1,2);
//console.log(result)

/*
let result = await getProducts(1);
if(result == null) {
    console.log("No product")
} else {
    result.forEach(e => {
        const p = e.data();
        console.log(e.id + "-" + p.name + "-" + p.description + "-" + p.price)
    })
}
*/
