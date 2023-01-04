const bcryptjs = require('bcryptjs');

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    // console.log(req.get('Cookie').split(';')[0])
    // const loggedIn = (req.get('Cookie').split(';')[0].trim().split('=')[1]);
    // console.log(req.session.loggedIn);
    let message = req.flash('error');
    if (message.length <= 0) {
        message = null;
    }
    // console.log(message);
    res.render('auth/auth.ejs', {
        pageTitle: 'Login',
        path: '/login',
        errorMessage: message,
    })
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email or password.');
                return res.redirect('/login');
            }

            bcryptjs.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        req.session.loggedIn = true;
                        req.session.user = user;
                        return req.session.save((err) => {
                            // console.log(err);
                            res.redirect('/');
                        });
                    }
                    req.flash('error', 'Invalid email or password.');
                    res.redirect('/login');
                })
                .catch(err => {
                    console.log(err);
                })

        })
        .catch(err => {
            console.log(err);
        })
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    User.findOne({ email: email })
        .then(userDoc => {
            if (userDoc) {
                req.flash('signup', 'An account with this e-mail already exists. Enter a new e-mail.');
                return res.redirect('/signup');
            }

            if (password !== confirmPassword) {
                req.flash('signup', 'Passwords do not match.');
                return res.redirect('/signup');
            }

            return bcryptjs.hash(password, 12)
                .then(hashedPass => {
                    const user = new User({
                        email: email,
                        password: hashedPass,
                        cart: { items: [] }
                    });

                    return user.save();
                })
                .then(result => {
                    if (result) {
                        res.redirect('/login');
                    }
                });
        })

        .catch(
            err => { console.log(err) }
        );
}

exports.getSignup = (req, res, next) => {

    let message = req.flash('signup');
    if (message.length <= 0) {
        message = null;
    }

    res.render('auth/signup.ejs', {
        pageTitle: 'Signup',
        path: '/signup',
        errorMessage: message,
    });
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        // console.log(err);
        res.redirect('/');
    })
}