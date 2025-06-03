const passport = require('passport');
const router = require('express').Router();

// Swagger docs
router.use('/', require('./swagger'));

// API routes
router.use('/customers', require('./customers'));
router.use('/products', require('./products'));

// Home route with auth status
router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.send(`
            <h1>Welcome ${req.user.displayName}!</h1>
            <img src="${req.user.profileUrl}" width="50" style="border-radius:50%">
            <p>You are logged in via GitHub</p>
            <a href="/logout">Logout</a>
        `);
    } else {
        res.send(`
            <h1>Welcome to the Store API</h1>
            <p>You are not logged in</p>
            <a href="/login">Login with GitHub</a>
        `);
    }
});

// GitHub auth routes
//router.get('/login', passport.authenticate('github', { scope: ['user:user'] }));

router.get('/login', passport.authenticate('github'));


router.get('/github/callback', 
    passport.authenticate('github', { 
        failureRedirect: '/api-docs',
        failureMessage: true 
    }),
    (req, res) => {
        console.log('Successful authentication, user:', req.user);
        res.redirect('/');
    }
);

 router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            console.error('Logout error:', err);
            return next(err);
        }
        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            res.redirect('/');
        });
    });
}); 

module.exports = router;