// download node JS => run: node realtime.js in terminal to run file
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, remove } from "firebase/database";

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

const app = initializeApp(firebaseConfig);
const db = getDatabase();

class User {
    //id, name, gender, birth, email, sdt, address
    constructor(id, name, gender, birth, email, phone_number, address) {
        this.ID = id;
        this.name = name;
        this.gender = gender;
        this.birth = birth;
        this.email = email;
        this.phone_number = phone_number;
        this.address = address;
    }
}

class Product{
    constructor(id, name, price, description) {
        this.ID = id;
        this.name = name;
        this.price = price;
        this.description = description;
    }
}
class Account{
    constructor(account_name, account_password, account_id) {
        this.account_user_id = account_id;
        this.account_name = account_name;
        this.account_password = account_password;
    }
}


/**
    Thêm 1 user, lấy thông tin user, lấy thông tin cụ thể của 1 user, sửa thông tin cho user, theo dõi thông tin của user, xóa user
    Thêm 1 product vào giỏ hàng của user, lấy ra thông tin các products có trong user_cart, xóa 1 product khỏi giỏ hàng
*/
async function checkRefExists(ref_path) {
    const reference = ref(db, ref_path);
    try {
        const snapshot = await get(reference);
        if(snapshot.exists()) {
            return true;
        } else {
            return false;
        }
    } catch(error) {
        return false;
    }
}

async function writeUserInformation(user) {
    const reference = ref(db, 'Users/' + user.ID);
    await set(reference , {
        user_name: user.name,
        user_gender: user.gender,
        user_birth: user.birth,
        user_email: user.email,
        user_phonenumber: user.phone_number,
        user_address: user.address
    });
}

async function writeAccount(account) {
    const reference = ref(db, 'Accounts/' + account.account_name)
    await set(reference, {
        account_password: account.account_password,
        account_user_id: account.account_user_id
    })
}

async function addProductToList(userID, product) {
    const reference = ref(db, "Users/" + userID + '/user_cart/' + product.ID)
    await set(reference, {
        product_name: product.name,
        product_price: product.price,
        product_description: product.description
    });
}

async function deleteProductInCart(userID, productID) {
    let path = 'Users/' + userID + '/user_cart/' + productID;
    let result = await checkRefExists(path);
    if(!result) {
        return false;
    }
    const reference = ref(db,path)
    try {
        await remove(reference);
        return true;
    }
    catch(error) {
        console.log("Error: " + error);
        return false;
    }
}

async function getUserData(userID) {
    try {
        const user_ref = ref(db, 'Users/' + userID);
        const snapshot = await get(user_ref);
        if(snapshot.exists()) {
            return snapshot.val();
        }
    }
    catch(error) {
        console.log("Error: " + error);
        throw error;
    }
    return null;
}

async function getAccountData(account_name) {
    const reference = ref(db, 'Accounts/' + account_name)
    try{
        const snapshot = await get(reference)
        if(snapshot.exists()) {
            return snapshot.val()
        }
    }catch(error) {
        console.log("Error:" + error)
    }
    return null
}
async function getSpecificUserData(UserID, field) {
    field = 'user_' + field; 
    try{
        const userRef = ref(db,'Users/' + UserID + '/' + field);
        const snapshot = await get(userRef);
        if(snapshot.exists()) {
            return snapshot.val();
        }
    }
    catch(error) {
        console.log("Error: " + error);
        throw error;
    }
    return null;
}

async function getUserProductData(userID) {
    const reference = ref(db, 'Users/' + userID + '/user_cart')
    try{
        const snapshot = await get(reference);
        if(snapshot.exists()) {
            return snapshot.val();
        }
    } catch(error) {
        console.log(error)
    }
    return null;
}

async function deleteUser(userID) {
    const data = await getUserData(userID)
    if(data == null) {
        //return false;
    }
    try{
        const UserRef = ref(db, 'Users/' + userID);
        await remove(UserRef);
        return true;
    }
    catch(error) {
        console.log(error);
        return false;
    }
}

async function updateUserData(userID, field, new_userData) {
    const data = await getUserData(userID)
    if(data == null) {
        return false;
    }
    field = 'user_' + field; 
    try {
        const reference = ref(db, 'Users/' + userID + '/' + field);
        await set(reference, new_userData);
        return true; 
    } catch(error) {
        console.log("Error: " + error)
        return false;
    }
}

async function checkUserCart(userID) {
    const reference = ref(db, 'Users/' + userID + '/user_cart')
    try{
        const snapshot = await get(reference);
        if(snapshot.exists()) {
            return true;
        } else {
            return false;
        }
    }
    catch(error) {
        console.log("Error: " + error);
        return false;
    }
}

async function getUserTotalProduct(userID) {
    const reference = ref(db, 'Users/' + userID + '/user_cart')
    try{
        const snapshot = await get(reference);
        if(snapshot.exists()) {
            const children_count = snapshot.size;
            return children_count;
        } else {
            return -1;
        }
    } catch(error) {
        console.log(error);
    }
}

// Your test code run here <3
/*Thêm 1 tài khoản vào 
let a = new Account('sharkT','123', 4)
await writeAccount(a)
*/

/* Lấy thông tin của 1 account
let data = await getAccountData('kiendc12')
console.log(data.account_password)
console.log(data.account_user_id)
*/

/* Thêm 1 người dùng vào trong db (tự sửa giá trị sao cho id-key không trùng lặp, nếu trùng lặp sẽ overwrite thông tin cũ) 
let u = new User(1,'Dinh Chi Kien','Nam','12-11-2004','kiendc@gmail.com','0948196260','Ha Noi');
await writeUserInformation(u);
*/

/* Lấy tất cả thông tin của 1 người dùng và lấy thông tin cụ thể của 1 trường nào đó
const result = await getUserData(1); // lay tat ca thong tin cua id tuong ung
console.log(result)
console.log("---------")
const result2 = await getSpecificUserData(3, 'cart'); // lay ra gio hang cua user voi id tuong ung
console.log(result2)
console.log("---------")
const result3 = await getSpecificUserData(4, 'name'); // lay ra ten user voi id tuong ung
console.log(result3);
*/

/* Update thong tin co san cua 1 user
let result = await updateUserData(4, 'name', 'Trxg Dat'); // neu tim thay thong tin va update thanh cong se tra ve true
if(result) {
    console.log("Success")
} else {
    console.log("failed")
}
let result2 = await updateUserData(10, 'name', 'Trxg Dat'); // thong tin khong ton tai tra ve false
if(result2) {
    console.log("Success")
} else {
    console.log("failed")
}
*/

/* Xoa 1 user di 
let result = await deleteUser('4'); // tra ve true neu xoa thanh cong va tra ve false neu k xoa duoc hoac khong tim thay
console.log(result);
*/

/* Them 1 san pham vao gio hang cua user (ProductID la id cua san pham o trong gio hang chu khong phai ID chinh cua san pham) 
let product_tmp = new Product(1, 'Mercedes', 10000000000,'Work hard to buy G63, GLC, S-tier, C-Tier, E-tier, Maybach')
await addProductToList(1, product_tmp)
*/

/* Kiem tra xem lieu 1 user co san pham nao trong gio hang khong? true = co false = khong
let result = await checkUserCart(10);
console.log(result)
let result2 = await checkUserCart(4)
console.log(result2);
*/

/* Lay tat ca thong tin cua 1 san pham
const data = await getUserProductData(2);
console.log(data)
*/

/* kiem tra xem 1 user co bao nhieu san pham trong gio hang
const result = await getUserTotalProduct(2);
console.log(result);
*/

/* xoa 1 san pham khoi gio hang
let result = await deleteProductInCart(2,1)
console.log(result)
*/



