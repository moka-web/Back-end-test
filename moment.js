const moment = require("moment");

let day = moment()
let bornDay = moment("19930811","YYYYMMDD")
let years= day.diff(bornDay,"years")
let days = bornDay.diff(day,"days")
console.log(days)


