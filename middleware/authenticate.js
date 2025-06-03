const isAuthenticated = (req, res, next) => {
    console.log('=== AUTHENTICATION CHECK ===');
    console.log('Request Path:', req.path);
    console.log('Authenticated:', req.isAuthenticated());
    
    if (req.isAuthenticated()) {
        console.log('User authenticated:', req.user.displayName);
        return next();
    }
    
    console.warn('Unauthorized access attempt');
    
    // Decide el tipo de respuesta basado en el encabezado Accept
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

/* const isAuthenticated = (req, res, next) => {
    console.log('Auth check - isAuthenticated:', req.isAuthenticated());
    console.log('Session:', req.session);
    console.log('User:', req.user);
    
    if (req.session.user === undefined) {
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
     res.redirect('/api-docs');
    }

    return next();
};

module.exports = isAuthenticated;
 */