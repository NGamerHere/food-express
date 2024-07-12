function loginMiddlewareHandle(req,res,next){
    if(req.session.userId){
        return res.redirect('/dashboard');
    }else{
        next();
    }
}
function loginAPIHandle(req,res,next){
    if(req.session.userId){
        return res.json({message:'you have already logged in'})
    }else{
        next();
    }
}

module.exports={
    loginMiddlewareHandle,
    loginAPIHandle
}