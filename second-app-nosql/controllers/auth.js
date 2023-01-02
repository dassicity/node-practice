const bcryptjs = require('bcryptjs');

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
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.redirect('/login');
            }

            bcryptjs.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        req.session.loggedIn = true;
                        req.session.user = user;
                        return req.session.save((err) => {
                            console.log(err);
                            res.redirect('/');
                        });
                    }
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