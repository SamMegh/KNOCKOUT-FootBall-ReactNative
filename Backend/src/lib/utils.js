import jwt from 'jsonwebtoken';

export const generateToken = (userid,res) => {
   const tooken= jwt.sign({userid}, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
res.cookie('JWT',tooken,{   //cookie is set in the browser
    maxAge: 7*24*60*60*1000,   //valide time for the auth key is 7 days 
    httpOnly:true,    //cookie is not accessible by the browser(prevent xss attack)
    sameSite:true,    //cookie is not accessible by the third party(prevent csrf attack)
    secure: process.env.NODE_ENV != 'production'

});
return tooken;
}