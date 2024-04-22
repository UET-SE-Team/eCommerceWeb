const connection = require('../configs/connectDB');
const db = connection.admin.firestore();

const getUsers = async (req, res) => {
    let userSnapshot = await db.collection('users').get();
    let userList = userSnapshot.docs.map(doc => {
        return {
            userID: doc.id,
            ...doc.data()
        };
    });
    return userList;
}

const createUser = async (req, res) => {
    try {
        let user = req.body;
        await db.collection('users').add({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            address: user.address,
            avatarLink: user.avatarLink
        });
        console.log(`>>> User has been added successfully.`);
        res.redirect('/');
    } catch (error) {
        console.error('>>> Error submitting user:', error);
        res.status(500).send('Error submitting user');
    }
}

const deleteUser = async (req, res) => {
    try {
        await db.collection('users').doc(req.body.userID).delete();
        console.log(`>>> User with ID ${req.body.userID} has been deleted successfully.`);
        res.redirect('/');
    } catch (error) {
        console.error(">>> Deleting error: ", error);
        res.status(500).send('Error deleting user');
    }
}

const getEditingPage = async (req, res) => {
    let info = (await db.collection('users').doc(req.params.userID).get()).data();
    info.userID = req.params.userID;
    //console.log(info);
    res.render('updateUser.ejs', { userData: info });
}

const getHomePage = async (req, res) => {
    let userList = await getUsers();
    res.render('index.ejs', { userData: userList });
};

const updateUser = async (req, res) => {
    try {
        await db.collection('users').doc(req.body.userID).update(req.body);
        res.redirect('/');
        console.log(`>>> User with ID ${req.body.userID} has been updated successfully.`);
    } catch (error) {
        console.error(">>> Updating error: ", error);
        res.status(500).send('Error updating user');
    }
}

const getCheckoutPage = async (req, res) => {
    res.render('checkout.ejs');
}

const getProductDetailsPage = async (req, res) => {
    res.render('product-details.ejs');
}

module.exports = {
    getHomePage,
    getUsers,
    createUser,
    deleteUser,
    updateUser,
    getEditingPage,
    getCheckoutPage,
    getProductDetailsPage,
};
