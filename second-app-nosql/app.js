const express = require('express');
const fs = require('fs');
const https = require('https');
const path = require('path');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const authRouter = require('./routes/auth');

const noPage = require('./controllers/404');
const errorPage = require('./controllers/500');
// const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

const MONGODB_URI = `${process.env.MONGODB_URI}`

const app = express();
const store = new MongoDBStore(
    {
        uri: MONGODB_URI,
        collection: 'sessions'
    }
);

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        // console.log("Destianation");
        cb(null, 'images');
    },

    filename: (req, file, cb) => {
        // console.log("Filename");
        cb(null, new Date().toDateString() + '-' + file.originalname);
    }
});

const filterType = (req, file, cb) => {
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}

// const privateKey = fs.readFileSync('server.key');
// const certificate = fs.readFileSync('server.cert');

app.set('view engine', 'ejs');          // Here you tell express which engine to use when it finds a template
app.set('views', 'views');              // Here you tell express where to find these templates. default folder is views, 
//if you do not have any folder named views then it's necessary to mention it here


// app.use((req, res, next) => {       // This function takes 3 arguments. request and response as usual but 
//     console.log("In a middleware"); // the next is a function which when executed will 
//     next();                         // allow the request to continue to the next middleware in line
// });
// console.log(process.env);

const accessLogs = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

app.use(helmet());  // adds more customized headers for security
app.use(compression()); // compresses assets before sending any request
app.use(morgan('combined', { stream: accessLogs }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter: filterType }).single('image'));
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));        // Used to serve static things like css and images. Now those can be accessed 
// at <url>/public
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(session({ secret: 'dassic', saveUninitialized: false, resave: false, store: store }));    // resave=false means the session will not be saved on every request but
// if any hting changes in the session. saveUniitialized=false means that no session will be saved for a request where it doesn't need to be saved.

app.use(csrf());
app.use(flash());

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.loggedIn;  // This tells express to pass this isAuthenticated
    res.locals.csrfToken = req.csrfToken();             // and csrfToken with every response cycle after request finishes execution.
    next();
})

app.use((req, res, next) => {
    if (!req.session.user) {
        // console.log("Inside app.js -> No user");
        return next();
    }

    // console.log("Hello");
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                next();
            }
            req.user = user;
            // console.log("Inside app.js -> findById");
            next();
        })
        .catch(err => {
            // console.log(err)
            throw new Error(err); // This error would not be catched by the universal error handling middleware. Because it in inside async code. What we instead need to do is call next(new Error(err)). As we did in catch block in various pplaces.
        });
})


// app.use(authRouter);
app.use('/admin', adminRouter);
app.use(shopRouter);
app.use(authRouter);
app.get('/500', errorPage.errorPage);
app.use(noPage.noPage);

app.use((error, req, res, next) => {
    res.redirect('/500');
});

// const server = http.createServer(app);

// server.listen(3000);

// mongoConnect((client) => {
//     // console.log(client);
//     app.listen(3000);
// });

mongoose.connect(MONGODB_URI)
    .then(result => {
        // console.log("Connected to DB");
        // https.createServer({ key: privateKey, cert: certificate }, app).listen(process.env.PORT || 3000);
        app.listen(process.env.PORT || 3000);
        console.log("connected to DB");
    }).catch(err => {
        console.log(err);
    })