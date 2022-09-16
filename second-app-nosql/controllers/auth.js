const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    // console.log(req.get('Cookie').split(';')[0])
    // const loggedIn = (req.get('Cookie').split(';')[0].trim().split('=')[1]);
    res.render('auth/auth.ejs', {
        pageTitle: 'Login',
        path: '/login',
        isAuthenticated: req.session.loggedIn
    })
}

exports.postLogin = (req, res, next) => {
    req.session.loggedIn = true;
    res.redirect('/');
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    User.findOne
}

exports.getSignup = (req, res, next) => {
    res.render('auth/signup.ejs', {
        title: 'Signup',
        path: '/signup',
        isAuthenticated: false,
    });
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    })
}