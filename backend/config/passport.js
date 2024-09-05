// backend/config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User'); // Adjust path based on your User model location

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists in our db
    let user = await User.findOne({ googleId: profile.id });
    if (user) {
      return done(null, user);
    }

    // If not, create a new user in our db
    user = await new User({
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value
    }).save();
    done(null, user);
  } catch (err) {
    console.error(err);
    done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
