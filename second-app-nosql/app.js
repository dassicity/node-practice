const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const authRouter = require('./routes/auth');

const errorPage = require('./controllers/404');
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');          // Here you tell express which engine to use when it finds a template
app.set('views', 'views');              // Here you tell express where to find these templates. default folder is views, 
//if you do not have any folder named views then it's necessary to mention it here


// app.use((req, res, next) => {       // This function takes 3 arguments. request and response as usual but 
//     console.log("In a middleware"); // the next is a function which when executed will 
//     next();                         // allow the request to continue to the next middleware in line
// });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));        // Used to serve static things like css and images. Now those can be accessed 

app.use((req, res, next) => {
    User.findById('6213aa88bf6a27e033d6e120')
        .then(user => {
            // console.log(user);
            req.user = new User(user.username, user.email, user.cart, user._id);
            next();
        })
        .catch(err => console.log(err));
})

app.use('/admin', adminRouter);
app.use(shopRouter);
app.use(authRouter);
// at <url>/public
app.use(errorPage.noPage);

// const server = http.createServer(app);

// server.listen(3000);

mongoConnect((client) => {
    // console.log(client);
    app.listen(3000);
});