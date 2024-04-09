const admin = require("firebase-admin");
const serviceAccount = require("../private/serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: serviceAccount.project_id
});

module.exports = {
    admin,
};