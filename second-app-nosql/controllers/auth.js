const crypto = require('crypto');
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const sgMail = require('@sendgrid/mail');

const User = require('../models/user');
const user = require('../models/user');
sgMail.setApiKey('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');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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'
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
                    res.redirect('/login');
                    return transporter.sendMail({
                        to: email,
                        from: 'dassic@outlook.com',
                        subject: 'Successfully signed Up',
                        html: '<h1>You successfully signed up!</h1>'
                    })
                        // sgMail.send({
                        //     to: email,
                        //     from: 'dassic@outlook.com',
                        //     subject: 'Signed Up Successfully!',
                        //     html: '<h1>You have successfully signed up to Dassify Shop!</h1>'
                        // })
                        .then(res => {
                            console.log('Email sent! To - ');
                            console.log(email);
                            console.log(res);
                        })
                        .catch(err => {
                            console.log(err);
                        })
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

exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    if (message.length <= 0) {
        message = null;
    }
    // console.log(message);
    res.render('auth/reset.ejs', {
        pageTitle: 'Reset Password',
        path: '/reset',
        errorMessage: message,
    })
}

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset');
        }

        const token = buffer.toString('hex');
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    req.flash('error', 'No user with that email address found!');
                    return res.redirect('/reset');
                }

                user.resetToken = token;
                user.resetTokenExpiry = Date.now() + 3600000;

                return user.save();
            })
            .then(result => {
                // console.log(result);
                res.redirect('/');
                transporter.sendMail({
                    to: req.body.email,
                    from: 'dassic@outlook.com',
                    subject: 'Reset your password!',
                    html: `
                    <p>You requested for a change to your current password.</p>
                    <p>Click <a href='https://localhost:3000/reset/${token}' >here</a> to reset your password!</p>
                    `
                })
                // sgMail.send({
                //     to: req.body.email,
                //     from: 'dassic@outlook.com',
                //     subject: 'Reset your password!',
                //     html: `
                //     <p>You requested for a change to your current password.</p>
                //     <p>Click <a href='https://localhost:3000/reset/${token}' >here</a> to reset your password!</p>
                //     `
                // })
            })
            .catch(err => {
                console.log(err);
            })
    });
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;

    user.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } })
        .then(user => {
            let message = req.flash('error');
            if (message.length <= 0) {
                message = null;
            }
            // console.log(message);
            res.render('auth/new-password.ejs', {
                pageTitle: 'Update Password',
                path: '/new-password',
                errorMessage: message,
                userId: user._id,
                resetToken: token
            })
        })
        .catch(err => {
            console.log(err);
        })
}

exports.postNewPassword = (req, res, next) => {
    const password = req.body.password;
    const userId = req.body.userId;
    const resetToken = req.body.token;
    let newUser;
    user.findOne({ _id: userId, resetToken: resetToken, resetTokenExpiry: { $gt: Date.now() } })
        .then(user => {
            newUser = user;
            return bcryptjs.hash(password, 12);
        })
        .then(hashedPass => {
            newUser.password = hashedPass;
            newUser.resetToken = undefined;
            newUser.resetTokenExpiry = undefined;
            return newUser.save();
        })
        .then(result => {
            res.redirect('/login');
        })
        .catch(err => {
            console.log(err);
        })
}