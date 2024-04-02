// SUB FILE FOR TESTING ONLY @@
// Text me if u want permission
import {initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, onValue, remove } from 'firebase/database';


const firebaseConfig = {
    apiKey: "AIzaSyCc7Jo7drB3oMMvyEDYNZ9ZQhWkKT7ozk0",
    authDomain: "testingfunny-61ca5.firebaseapp.com",
    databaseURL: "https://testingfunny-61ca5-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "testingfunny-61ca5",
    storageBucket: "testingfunny-61ca5.appspot.com",
    messagingSenderId: "519107952910",
    appId: "1:519107952910:web:19f4828732a4e5aa39d75f",
    measurementId: "G-ZXV1QRDJE7"
  };

const app = initializeApp(firebaseConfig);
const db = getDatabase();

async function writeInformationUser(userID, name, email, address) {
  const reference = ref(db,'users/' + userID);
  await set(reference, {
    username: name,
    useremail: email,
    useraddress: address
  });

}

async function writeLocation(locationID, locationName, locationCountry) {
  const reference = ref(db, 'location/' + locationID);
  await set(reference,{
    locationName: locationName,
    locationCountry: locationCountry
  });
}

// onValue: lang nghe su kien khi no thay doi data
async function checkUserInformation(userID) {
  const UserRef = ref(db, 'users/' + userID + "/username");
  
  onValue(UserRef, (snapshot) => {
    let data = snapshot.val();
    console.log(data)
  })
}

async function getUserData(userID) {
  try {
    // Tạo một tham chiếu đến vị trí dữ liệu người dùng
    const userRef = ref(db, 'users/' + userID + '/username');

    // Sử dụng phương thức get() để lấy dữ liệu một lần
    const snapshot = await get(userRef);
    
    // Trả về dữ liệu từ snapshot
    return snapshot.val();
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error("Error getting user data:", error);
    throw error; // Chuyển tiếp lỗi để xử lý ở nơi gọi
  }
}

async function getLocationData(locationID) {
  const refer = ref(db, 'location/' + locationID);
  const snapshot = await get(refer);
  return snapshot.val();    
}

// xoa 1 cap key value
function deleteIn4() {
  remove(ref(db, 'location/locationId'))
    .then(() => {
      console.log("Cặp key-value đã được xóa thành công!");
    })
    .catch((error) => {
      console.error("Lỗi xóa cặp key-value:", error);
    });
}

/*
// Sử dụng phương thức để lấy dữ liệu của một người dùng cụ thể
getUserData("3").then((userData) => {
  console.log(userData);
}).catch((error) => {
  console.error("Error:", error);
});


let data = await getUserData(2);
console.log(data);

let locationData = await getLocationData('locationId');
console.log(locationData)
*/
