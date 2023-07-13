const user=require('./../modals/usermodal');
const CatchAssync=require("../utils/CatchAssync")
const AppError=require("../utils/AppError")
const jwt = require('jsonwebtoken')
const {promisify} = require('util')

const singedToken=id=>{
    return jwt.sign({ id },process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    })
}

exports.signup =CatchAssync( async (req,res,next)=>{
    
    const newUser= await user.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        passwordConfirm:req.body.passwordConfirm,
        passwordChanged:req.body.passwordChanged,
        role:req.body.role
    });
    const token=singedToken(newUser._id);
    res.status(201).json({
        status: "success",
        token:token,
        newUser:newUser
    })
});
exports.login= CatchAssync (async(req,res,next)=>{
    const {email,password}=req.body;

    // check if the email andd password exists
    if(!email || !password){
       return next(new AppError('provide a email and password',400));
    }
    // check user exits
    const User = await user.findOne({email}).select('+password');
    
    //  check email and password matched
    if(!User || !await User.correctpassword(password,User.password)){
        return next(new AppError('Incorrect email or password',401));
    }
    const token = singedToken(User._id);
        res.status(200).json({
        status:"success",
        token 
    });


})
exports.protect= CatchAssync(async(req,res,next)=>{

    // gett the there is a token
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token=req.headers.authorization.split(' ')[1];
    } 
    if(!token){
        return next(new AppError('user not loged in',401));
    }
    // check is the token is correctr
    const decoder = await promisify(jwt.verify)(token,process.env.JWT_SECRET);
    // check if the user exists or deleted
    // console.log(decoder);
    const currentUser= await user.findById(decoder.id);
    // console.log(currentUser.name);
    if(!currentUser){
        return next(new AppError('user does not exists'),401);
    }
    // console.log(decoder);
    // check if the password is changes after taking the token 
    if(currentUser.checkPasswordChanges(decoder.iat)){
        return next(new AppError('user changed password resently , login again'));
    }
    req.user=currentUser;
    next();

})
exports.restrictTo = (...roles)=>{
    return (req,res,next)=>{
        console.log(req.user);
        if(!roles.includes(req.user.role)){
            return next(new AppError('you are not authorised to perform this action',403));
        }
        next();
    };

} ;