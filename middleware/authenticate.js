const isAuthenticated = (req, res, next) => {
    console.log('Auth check - isAuthenticated:', req.isAuthenticated());
    console.log('Session:', req.session);
    console.log('User:', req.user);
    
    if (req.isAuthenticated()) {
        return next();
    }
    
    console.warn('Unauthorized access attempt:', {
        path: req.path,
        method: req.method,
        ip: req.ip
    });
    
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
};

module.exports = isAuthenticated;