

function resDashboardHandle(req,res,next){
    if (req.session.userId && req.session.role ==='restaurant' ) {
        next();
    } else {
        res.redirect('/login');
    }
}

module.exports=resDashboardHandle;