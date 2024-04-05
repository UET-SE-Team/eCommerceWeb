const connection = require('../configs/connectDB');

const getUsers = async (req, res) => {
    const db = connection.firestore.getFirestore(connection.firebaseApp);
    const usersCol = connection.firestore.collection(db, 'users');
    const userSnapshot = await connection.firestore.getDocs(usersCol);
    const userList = userSnapshot.docs.map(doc => doc.data());
    //const userList = userSnapshot.docs;
    return JSON.stringify(userList);
}

const getHomePage = (req, res) => {
    res.render('index.ejs', { userData: getUsers });
};

const getSubPage = (req, res) => {
    res.send('This is sub page');
};

module.exports = {
    getHomePage,
    getSubPage,
    getUsers
};