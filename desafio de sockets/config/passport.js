const {isValidPassword,createHash} = require('../utils/passwordValidates');
const {users} = require('../src/daos/mainDaos');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const sendEmail = require("../utils/sendEmail");
const Usuarios = require("../src/modelsMDB/schemaUsers")



initialize = (passport) =>{

    passport.use("login",
  new localStrategy((username,password,done)=>{
    Usuarios.findOne({ username }, (err, user) => {
      if (err) return done(err);

      if (!user) {
        console.log("User Not Found with username " + username);
        return done(null, false);
      }

      if (!isValidPassword(user, password)) {
        console.log("Invalid Password");
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
      console.log(req.body)

      Usuarios.findOne({ username: username }, function (err, user) {
        if (err) {
          console.log("Error in SignUp: " + err);
          return done(err);
        }

        if (user) {
          console.log("User already exists");
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
            console.log("Error in Saving user: " + err);
            return done(err);
          }

          console.log(user);
          console.log("User Registration succesful");

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