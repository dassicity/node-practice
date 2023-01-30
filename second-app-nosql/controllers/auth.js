const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const sgMail = require('@sendgrid/mail');

const User = require('../models/user');
sgMail.setApiKey('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');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: 'SG.QvknE4zdSi2up7vLe6JSQg.0R6Sdffi8bZ6G9RcVQ3X7AmP0weOixNs2lyOZyqfX - k'
    }
}))

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
                    // return transporter.sendMail({
                    //     to: email,
                    //     from: 'dassic@outlook.com',
                    //     subject: 'Successfully signed Up',
                    //     html: '<h1>You successfully signed up!</h1>'
                    // });
                    sgMail.send({
                        to: email,
                        from: 'dassic@outlook.com',
                        subject: 'Signed Up Successfully!',
                        html: '<h1>You have successfully signed up to Dassify Shop!</h1>'
                    })
                        .then(res => {
                            console.log('Email sent!');
                            console.log(res);
                        })
                        .catch(err => {
                            console.log(err);
                        })
                    res.redirect('/login');
                })
                .catch(err => {
                    console.log(err);
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