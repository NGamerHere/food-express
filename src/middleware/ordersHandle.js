function login(req, res,next){
    if(req.session.userId){
        next();
    }else{
        return res.status(401).send('Not logged in');
    }
}

module.exports=login;