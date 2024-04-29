const connection = require('../configs/connectDB');
const admin = connection.admin;
const db = admin.firestore();

var uid;

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
        const userDoc = await db.collection('users').doc(user.uid).get();

        if (!userDoc.exists) {
            await db.collection('users').doc(user.uid).set({
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
                avatarLink: user.avatarLink,
            });
            console.log(`>>> User has been added successfully `);
            res.redirect('/');
        } else {
            console.log(`>>> User already exists `);
            res.status(400).send('User already exists');
        }
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

const postSettings = async (req, res) => {
    uid = req.body.uid;
}

const getSettings = async (req, res) => {
    db.collection('users').doc(uid).get()
        .then(doc => {
            let info = doc.data();
            res.render('settings.ejs', { userData: info });
        })
        .catch(error => {
            console.error('Error getting user data:', error);
            res.status(500).send('Internal Server Error');
        });
}

const postUserInfo = async (req, res) => {
    uid = req.body.uid;
    db.collection('users').doc(uid).get()
        .then(doc => {
            let info = doc.data();
            return res.json(info);
        })
        .catch(error => {
            console.error('Error getting user data:', error);
            res.status(500).send('Internal Server Error');
        });
}

const getUserInfo = async (req, res) => {
    db.collection('users').doc(uid).get()
        .then(doc => {
            let info = doc.data();
            return res.json(info);
        })
        .catch(error => {
            console.error('Error getting user data:', error);
            res.status(500).send('Internal Server Error');
        });
}
const uploadAvatar = async (req, res) => {
    console.log(req.body.uid);
    console.log("Tên tệp tải lên:", req.file.filename);
    const avtLink = '/images/avatar/' + req.file.filename;
    await db.collection('users').doc(req.body.uid).set({
        avatarLink: avtLink
    }).then(() => {
        res.redirect('/settings');
    })
}

const getAdminPage = async (req, res) => {
    res.render('admin.ejs');
}

const addAdminRole = async (req, res) => {
    const email = req.body.email;
    console.log(email);
    try {
        return admin.auth().getUserByEmail(email)
            .then(user => {
                return admin.auth().setCustomUserClaims(user.uid, {
                    admin: true
                }).then(() => {
                    console.log(">>>sucess uid: " + user.uid);
                    res.redirect('/admin');
                    //res.status(200).json({ success: true });
                })
            })
            .catch(error => {
                res.status(500).send(error);
            });
    } catch (error) {
        res.status(500).send(error);
    }
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
    getSettings,
    postSettings,
    postUserInfo,
    getUserInfo,
    uploadAvatar,
    getAdminPage,
    addAdminRole
};
