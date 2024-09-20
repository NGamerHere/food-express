function dashboardSessionHandle(req,res,next){
    if (req.session.userId && req.session.role ==='customer' ) {
        next();
    } else {
        res.redirect('/login');
    }
}
function homeSessionHandle(req,res,next){
    if(req.session.userId && req.session.role ==='customer' ){
        return res.redirect('/dashboard');
    }else{
        next();
    }
}

module.exports={
    dashboardSessionHandle,
    homeSessionHandle
};