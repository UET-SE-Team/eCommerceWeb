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
    return app.use('/', router);
}

module.exports = initWebRoute;
