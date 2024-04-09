require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT;
const configViewEngine = require('./configs/viewEngine');
const initWebRoute = require('./routes/web');

//Parse HTTP request
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

configViewEngine(app);
initWebRoute(app);

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
});