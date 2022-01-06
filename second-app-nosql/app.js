const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const errorPage = require('./controllers/404');

const app = express();

app.set('view engine', 'ejs');          // Here you tell express which engine to use when it finds a template
app.set('views', 'views');              // Here you tell express where to find these templates. default folder is views, 
//if you do not have any folder named views then it's necessary to mention it here


// app.use((req, res, next) => {       // This function takes 3 arguments. request and response as usual but 
//     console.log("In a middleware"); // the next is a function which when executed will 
//     next();                         // allow the request to continue to the next middleware in line
// });

app.use(bodyParser.urlencoded({ extended: false }));

app.use(adminRouter);
app.use(shopRouter);
app.use(express.static(path.join(__dirname, 'public')));

app.use(errorPage.noPage);

// const server = http.createServer(app);

// server.listen(3000);

app.listen(3000);