const parseArgs = require('minimist');
const dotenv = require('dotenv')
dotenv.config()

//se pasa por console node server.js --PORT +num
const args = parseArgs(process.argv.slice(2))

const PORT= args.PORT || process.env.PORT || 8080;
const MPASS = process.env.MONGOATLAS;
const MUSER=  process.env.USERMONGO;

module.exports = {PORT, MPASS,MUSER}