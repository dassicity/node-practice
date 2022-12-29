const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    // console.log(req.get('Cookie').split(';')[0])
    // const loggedIn = (req.get('Cookie').split(';')[0].trim().split('=')[1]);
    // console.log(req.session.loggedIn);
    res.render('auth/auth.ejs', {
        pageTitle: 'Login',
        path: '/login',
        isAuthenticated: req.session.loggedIn
    })
}

exports.postLogin = (req, res, next) => {
    User.findById('6213aa88bf6a27e033d6e120')
        .then(user => {
            req.session.loggedIn = true;
            req.session.user = user;
            req.session.save((err) => {
                console.log(err);
                res.redirect('/');
            });
        })
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    User.findOne;
}

exports.getSignup = (req, res, next) => {
    res.render('auth/signup.ejs', {
        pageTitle: 'Signup',
        path: '/signup',
        isAuthenticated: false,
    });
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        // console.log(err);
        res.redirect('/');
    })
}