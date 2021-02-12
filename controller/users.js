const { isLoggedIn } = require('../middleware');
const User = require('../models/user');

module.exports.renderRegister = (req, res)=>{
    if(req.isAuthenticated()){
        return res.redirect("/campgrounds");
    }
    res.render("users/register");
}

module.exports.register = async(req, res)=>{
    try {
        const { username, email, password, name } = req.body;
        const user = new User({ username, email, name });
        const registeredUser = await User.register(user, password);
        //  = await DefaultUser.authenticate()('user', 'password');
        req.login(registeredUser, (err) => {
            if (err) { return next(err); }
            req.flash('success', 'Welcome to Yelp Camp!!!');
            res.redirect("/campgrounds/");
          });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect("/register");
    }
}

module.exports.renderLogin = (req, res)=>{
    if(req.isAuthenticated()){
        return res.redirect("/campgrounds");
    }
    res.render("users/login");
}
 
module.exports.login = async(req, res)=>{
    req.flash('success', 'Welcome Back!!!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'GoodBye!!!');
    res.redirect('/campgrounds')
}