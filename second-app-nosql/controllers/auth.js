exports.getLogin = (req, res, next) => {
    // console.log(req.get('Cookie').split(';')[0])
    const loggedIn = (req.get('Cookie').split(';')[0].trim().split('=')[1]);
    res.render('auth/auth.ejs', {
        title: 'Login',
        path: '/login',
        isAuthenticated: loggedIn,
    })
}

exports.postLogin = (req, res, next) => {
    res.setHeader('Set-Cookie', 'loggedIn=true');
    res.redirect('/');
}