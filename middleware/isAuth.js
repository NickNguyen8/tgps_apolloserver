import jwt from 'jsonwebtoken';


export default  (req,res,next) =>{
    const authHeader = req.get('Authorization');

    if(!authHeader){
        req.isAuth = false;
        return next();
        console.log('no auth header');
    }
    const token = authHeader.split(' ')[1]; // Authorization: bearer token value 
    if(!token || token ===''){
        req.isAuth = false;
        return next();
        console.log('no token');

    }
    let decodedToken;
    try{
        decodedToken=jwt.verify(token,process.env.JWT_PASSWORD );
    }
    catch(Err){
        console.log('cant decode');

        req.isAuth = false;
        return next();
    }
    if(!decodedToken){
        console.log('cant decode2');

        req.isAuth = false;
        return next();
    }
    req.isAuth=true;
    req.userId= decodedToken.userId;
    // console.log('in isauth bewfore final return: ' +  req.userId);
    return next();


}