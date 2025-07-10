import jwt from 'jsonwebtoken'

export const generatorToken = (localId, res) => {
    const token = jwt.sign({ localId }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });

    res.cookie('JWT', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,    //cookie is not accessible by the browser(prevent xss attack)
        sameSite: true,    //cookie is not accessible by the third party(prevent csrf attack)
        secure: process.env.NODE_ENV != 'production'

    });
    return token;
}