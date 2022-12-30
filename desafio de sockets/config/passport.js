const {isValidPassword,createHash} = require('../utils/passwordValidates');
const {users} = require('../src/daos/mainDaos');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const sendEmail = require("../utils/sendEmail");
const Usuarios = require("../src/modelsMDB/schemaUsers");
const logger = require('./winston');



initialize = (passport) =>{

    passport.use("login",
  new localStrategy((username,password,done)=>{
    Usuarios.findOne({ username }, (err, user) => {
      if (err) return done(err);

      if (!user) {
        logger.info("User Not Found with username " + username);
        return done(null, false);
      }

      if (!isValidPassword(user, password)) {
        logger.info("Invalid Password");
        return done(null, false);
      }

      return done(null, user);
    })
  })
);

passport.use(
  "signup",
  new localStrategy(
    {
      passReqToCallback: true,
    },
    (req, username, password, done) => {
      

      Usuarios.findOne({ username: username }, function (err, user) {
        if (err) {
          logger.info("Error in SignUp: " + err);
          return done(err);
        }

        if (user) {
          logger.info("User already exists");
          return done(null, false);
        }

        const newUser = {
          username: username,
          password: createHash(password),
          email:req.body.email,
          address:req.body.address,
          age:req.body.age,
          phone:req.body.phone
        };
        Usuarios.create(newUser, (err, userWithId) => {
          if (err) {
            logger.info("Error in Saving user: " + err);
            return done(err);
          }

          
          logger.info("User Registration succesful");

          sendEmail('mokajua@gmail.com',"Nuevo Registro",JSON.stringify(newUser,null,2))

          return done(null, userWithId);
        });
      });
    }
  )
);


passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  
  passport.deserializeUser(async (id, done) => {
    Usuarios.findById(id, done);

  });


}

module.exports= initialize;