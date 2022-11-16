const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const authRouter = require('./routes/auth');

const errorPage = require('./controllers/404');
// const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');


const app = express();
const store = new MongoDBStore(
    {
        uri: 'mongodb+srv://dassic:Dassic007@cluster0.ad9yl.mongodb.net/shop?',
        collection: 'sessions'
    }
);

app.set('view engine', 'ejs');          // Here you tell express which engine to use when it finds a template
app.set('views', 'views');              // Here you tell express where to find these templates. default folder is views, 
//if you do not have any folder named views then it's necessary to mention it here


// app.use((req, res, next) => {       // This function takes 3 arguments. request and response as usual but 
//     console.log("In a middleware"); // the next is a function which when executed will 
//     next();                         // allow the request to continue to the next middleware in line
// });
// console.log(process.env);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));        // Used to serve static things like css and images. Now those can be accessed 
// at <url>/public
app.use(session({ secret: 'dassic', saveUninitialized: false, resave: false, store: store }));    // resave=false means the session will not be saved on every request but
// if any hting changes in the session. saveUniitialized=false means that no session will be saved for a request where it doesn't need to be saved.

app.use((req, res, next) => {
    User.findById('6213aa88bf6a27e033d6e120')
        .then(user => {
            // console.log(user);
            req.user = new User(user.username, user.email, user.cart, user._id);
            next();
        })
        .catch(err => console.log(err));
})

// app.use(authRouter);
app.use('/admin', adminRouter);
app.use(shopRouter);
app.use(authRouter);
app.use(errorPage.noPage);

// const server = http.createServer(app);

// server.listen(3000);

// mongoConnect((client) => {
//     // console.log(client);
//     app.listen(3000);
// });

mongoose.connect('mongodb+srv://dassic:Dassic007@cluster0.ad9yl.mongodb.net/shop?retryWrites=true&w=majority')
    .then(result => {
        console.log("Connected to DB");
        app.listen(3000);
    }).catch(err => {
        console.log(err);
    })