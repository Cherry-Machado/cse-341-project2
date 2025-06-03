const isAuthenticated = (req, res, next) => {
    console.log('=== AUTHENTICATION CHECK ===');
    console.log('Request Path:', req.path);
    console.log('Authenticated:', req.isAuthenticated());
    
    if (req.isAuthenticated()) {
        console.log('User authenticated:', req.user.displayName);
        return next();
    }
    
    console.warn('Unauthorized access attempt');
    
    // Decide the kind of answer based on the header Accept
    if (req.accepts('json')) {
        res.status(401).json({
            success: false,
            error: {
                message: "Authentication required",
                code: "UNAUTHORIZED",
                details: {
                    suggestion: "Please login via GitHub first",
                    loginUrl: "/login"
                }
            }
        });
    } else {
        res.redirect('/login');
    }
};

module.exports = isAuthenticated;