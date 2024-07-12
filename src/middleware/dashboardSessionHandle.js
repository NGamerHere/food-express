const pool = require("../db");

function dashboardSessionHandle(req,res,next){
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/login');
    }
}
function homeSessionHandle(req,res,next){
    if(req.session.userId){
        return res.redirect('/dashboard');
    }else{
        next();
    }
}

module.exports={
    dashboardSessionHandle,
    homeSessionHandle
};