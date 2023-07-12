const jwt               = require("jsonwebtoken")
const os                = require("os")
const passport          = require('passport')
const GoogleStrategy    = require('passport-google-oauth20').Strategy;
const User              = require("../../database/models/User")
const getProfilePic                           = require("../profile/getProfilePicture")
const {verifyUspMember, verifyBccMember}      = require("../other/verifyMember");
const prettyPrint       = require("../other/prettyPrint")

passport.serializeUser(async function(user, done) {

    try{
        const token = jwt.sign({_id: user._id.toString()},process.env.JWT_SECRET, {expiresIn:'100 days'})

        user.tokens = user.tokens.concat({token, machine: os.hostname(), os: os.type() + os.release()})
        await user.save()

        //Verifications for Roles
        verifyUspMember(user.email)
        verifyBccMember(user.email)

        done(null, token)

    }catch{
      prettyPrint("Auth", "Could not read cookie!", "warning")

      done(null, false, { message: 'Bad Session' })
    }
    

});
  
passport.deserializeUser( async function(token, done) {

    try{

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findOne({_id: decoded, "tokens.token": token})

        if(!user){throw new Error()}

        done(null, {...user.toObject(), token})

    }catch{
      prettyPrint("Auth", "Could not verify token!", "warning")

      done(null, false, { message: 'Bad Session' })
    }

});


//---------------Start Google strategy----------------
passport.use( new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/redirect"
  },

  async (accessToken, refreshToken, profile, cb) => {

    const googleId = profile.id
    const email    = profile.emails[0].value
    const name     = profile.displayName

    try{

      const userDb    = await User.findOne({email})
      const dataPic   = await getProfilePic(profile.photos[0].value)
      
      //New user
      if(!userDb){
        const user = await User.create({googleId, email, name, roles: ['default'], profilePic: dataPic, nick: Date.now().toString(16)})
        prettyPrint("Auth", `Created new user: ${email} (Google)`, "info")
        return cb(null, user)
      }

      //Existing user
      await User.updateOne({email}, {googleId, email, name, profilePic: dataPic})
      prettyPrint("Auth", `Login: ${email} (Google)`, "info")
      return cb(null, userDb)
 
    }catch(e){cb(null, false, { message: 'Bad Session' })}

  }
));
//----------------------------------------------------
