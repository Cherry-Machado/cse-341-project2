const express = require('express');
const app = express();
const MongoStore = require('connect-mongo');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');
const User = require('./models/user');



// Middlewares
const { jsonParser, urlencodedParser } = require('./middleware/bodyParserConfig');
const { handleJsonErrors, handleAppErrors } = require('./middleware/errorHandler');
const { securityHeaders } = require('./middleware/securityHeaders');
const notFoundHandler = require('./middleware/notFoundHandler');


// Basic Configuration
app
 .use(jsonParser)
 app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URL,
    collectionName: 'sessions'
  })
}))
 .use(passport.initialize())
 .use (passport.session())
 .use(securityHeaders)
 .use(cors({
  origin: true, 
  methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
  credentials: true //Let cookies of sesión
  }))
 .use(urlencodedParser);
 
app.use('/', require('./routes'));
 
// Handling JSON Errors
app
.use(handleJsonErrors)
// 404 Handler
.use(notFoundHandler)
// Handling Errors
.use(handleAppErrors);

// server.js

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL
},
async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('GitHub Profile:', profile); // For depuration
    const user = await User.findOrCreate(profile);
    return done(null, user);
  } catch (err) {
    console.error('Error in GitHub strategy:', err);
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user._id); // Almacenar solo el ID
});

passport.deserializeUser(async (id, done) => {
  try {
    // Buscar usuario en DB por ID
    const user = await User.findById(id); 
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Initializing Server
const port = process.env.PORT || 3000;
require('./middleware/databaseConnection').initDatabase(app, port);