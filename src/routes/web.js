const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

const initWebRoute = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/subpage', homeController.getUsers);
    router.post('/create-user', homeController.createUser);
    router.post('/delete-user', homeController.deleteUser);
    router.post('/update-user', homeController.updateUser);
    router.get('/edit-user/:userID', homeController.getEditingPage);
    router.get('/checkout', homeController.getCheckoutPage);
    router.get('/product-details', homeController.getProductDetailsPage);
    router.post('/settings', homeController.postSettings);
    router.get('/settings', homeController.getSettings);
    router.post('/user-info', homeController.postUserInfo);
    router.get('/user-info', homeController.getUserInfo);
    //router.post('upload-avatar', homeController.uploadAvatar);
    router.get('/admin', homeController.getAdminPage);
    router.post('/addAdminRole', homeController.addAdminRole);
    return app.use('/', router);
}

module.exports = initWebRoute;
