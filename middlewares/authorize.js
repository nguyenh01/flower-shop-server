const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const { secret } = require('../config.json');
// const db = require('_helpers/db');

module.exports = {

    // authorize(roles = []) {
    //     // roles param can be a single role string (e.g. Role.User or 'User') 
    //     // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    //     if (typeof roles === 'string') {
    //         roles = [roles];
    //     }

    //     return [
    //         // authenticate JWT token and attach user to request object (req.user)
    //         jwt({ secret, algorithms: ['HS256'] }),

    //         // authorize based on user role
    //         async (req, res, next) => {
    //             const account = await db.Account.findByPk(req.user.id);

    //             if (!account || (roles.length && !roles.includes(account.role))) {
    //                 // account no longer exists or role not authorized
    //                 return res.status(401).json({ message: 'Unauthorized' });
    //             }

    //             // authentication and authorization successful
    //             req.user.role = account.role;
    //             const refreshTokens = await account.getRefreshTokens();
    //             req.user.ownsToken = token => !!refreshTokens.find(x => x.token === token);
    //             next();
    //         }
    //     ];
    // },

    async signAccessToken (id) {
        return new Promise((resolve, reject) => {
            const payload = {
                id
            }
            const secret = process.env.ACCESS_TOKEN_SECRET;
            const options = {
                expiresIn: "1h"
            }
    
            jwt.sign(payload, secret, options, (error, token) => {
                if (error) {
                    reject(error);
                }
                resolve(token);
            })
        })
    },
    
    verifyAccessToken (req, res, next) {
        console.log('first')
        if (!req.headers['authorization']) {
            next()
        }
        const token = req.headers['authorization']?.split(' ')[1]
        console.log('token2', token)
        if (!token) {
            return
        }
        ///Verify token
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) =>{
            console.log('this is verify')
            if(err) {
                console.log('this is error', err)
                if(err.name === 'JsonWebTokenError')
                {
                    return next(createError.Unauthorized())
                }
                return next(createError.Unauthorized(err.message));
                }
            console.log('this is payload', payload)
            req.payload = payload
            next();
        })
    },
    
    async signRefreshToken (id) {
        return new Promise((resolve, reject) => {
            const payload = {
                id
            }
            const secret = process.env.REFRESH_TOKEN_SECRET;
            const options = {
                expiresIn: "1y"
            }
    
            jwt.sign(payload, secret, options, (error, token) => {
                if (error) {
                    reject(error);
                }
                resolve(token);
            })
        })
    },
    
    async verifyRefreshToken (refreshToken) {
        return new Promise((resolve, reject) => {
            JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, payload)=>{
                try{
                    if(err) reject(err); //Catch invalid token
                    let rfToken = await client.get(payload.userId)
                    if (rfToken === refreshToken) {
                        return resolve(payload)
                    }
                    return reject(createError.Unauthorized()); //Check token isexist in redis db
                }
                catch(err){
                    reject(createError.InternalServerError());
                }
            })
        })
    }
}