

async function postLogin (req,res){
    res.redirect('/')
}

async function getSignUp (req,res){
    res.render("formSignUp")
}

async function postSignUp(req,res){
    const {username} = req.user
    req.session.username = username;
    res.redirect('/')
}

async function logOut (req,res){
    try {
        req.logout();
    res.redirect("/");
    } catch (error) {
        logger.error(error)
    }
}


module.exports = {postLogin,getSignUp,postSignUp,logOut}