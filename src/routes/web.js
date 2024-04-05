const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

const initWebRoute = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/subpage', homeController.getUsers);
    return app.use('/', router);
}

module.exports = initWebRoute;
