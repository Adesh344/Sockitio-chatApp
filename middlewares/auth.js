const isLogin = async(req,res,next)=>{
    try {
        if(req.session.User){
        }
        else{
            res.redirect('/login');
        }
       next();
    } catch (error) {
        console.log(error.message);
    }
};

const isLogout = async(req,res,next)=>{
    try {
        if(req.session.User){
            res.redirect('/dashboard');
        }
       next();
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    isLogin,
    isLogout
};