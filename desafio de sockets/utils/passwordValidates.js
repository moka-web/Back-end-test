const bcrypt= require('bcrypt');

function isValidPassword(user, password) {
    return bcrypt.compareSync(password, user.password);
  }
  function createHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
  }


  module.exports={isValidPassword,createHash};