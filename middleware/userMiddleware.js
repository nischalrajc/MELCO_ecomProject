module.exports={
    cartValidation(req,res,next){
        if(req.session.logedin){
            next();
        }else{
            res.redirect('/login')
        }
    },
    userValidate(req,res,next){
        if(req.session.logedin){
            next()
        }else{
            res.redirect('/')
        }
    },
    wishListValidation(req,res,next){
        if(req.session.logedin){
            next();
        }else{
            res.redirect('/login')
        }
    },
    paymentValidate(req,res,next){
        if(req.session.user.orderplace){
            next()
        }else{
            res.redirect('/')
        }
    },
    
}