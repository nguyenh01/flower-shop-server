// const express = require('express');
// const router = express.Router();
// const validateRequest = require('_middleware/validate-request');
// const authorize = require('_middleware/authorize')
// const Role = require('_helpers/role');
// const accountService = require('./account.service');

// function authenticateSchema(req, res, next) {
//     const schema = Joi.object({
//         email: Joi.string().required(),
//         password: Joi.string().required()
//     });
//     validateRequest(req, next, schema);
// }

// function authenticate(req, res, next) {
//     const { email, password } = req.body;
//     const ipAddress = req.ip;
//     accountService.authenticate({ email, password, ipAddress })
//         .then(({ refreshToken, ...account }) => {
//             setTokenCookie(res, refreshToken);
//             res.json(account);
//         })
//         .catch(next);
// }

// function refreshToken(req, res, next) {
//     const token = req.cookies.refreshToken;
//     const ipAddress = req.ip;
//     accountService.refreshToken({ token, ipAddress })
//         .then(({ refreshToken, ...account }) => {
//             setTokenCookie(res, refreshToken);
//             res.json(account);
//         })
//         .catch(next);
// }

// function revokeTokenSchema(req, res, next) {
//     const schema = Joi.object({
//         token: Joi.string().empty('')
//     });
//     validateRequest(req, next, schema);
// }

// function revokeToken(req, res, next) {
//     // accept token from request body or cookie
//     const token = req.body.token || req.cookies.refreshToken;
//     const ipAddress = req.ip;

//     if (!token) return res.status(400).json({ message: 'Token is required' });

//     // users can revoke their own tokens and admins can revoke any tokens
//     if (!req.user.ownsToken(token) && req.user.role !== Role.Admin) {
//         return res.status(401).json({ message: 'Unauthorized' });
//     }

//     accountService.revokeToken({ token, ipAddress })
//         .then(() => res.json({ message: 'Token revoked' }))
//         .catch(next);
// }

// function registerSchema(req, res, next) {
//     const schema = Joi.object({
//         title: Joi.string().required(),
//         firstName: Joi.string().required(),
//         lastName: Joi.string().required(),
//         email: Joi.string().email().required(),
//         password: Joi.string().min(6).required(),
//         confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
//         acceptTerms: Joi.boolean().valid(true).required()
//     });
//     validateRequest(req, next, schema);
// }

// function register(req, res, next) {
//     accountService.register(req.body, req.get('origin'))
//         .then(() => res.json({ message: 'Registration successful, please check your email for verification instructions' }))
//         .catch(next);
// }

// function verifyEmailSchema(req, res, next) {
//     const schema = Joi.object({
//         token: Joi.string().required()
//     });
//     validateRequest(req, next, schema);
// }

// function verifyEmail(req, res, next) {
//     accountService.verifyEmail(req.body)
//         .then(() => res.json({ message: 'Verification successful, you can now login' }))
//         .catch(next);
// }

// function forgotPasswordSchema(req, res, next) {
//     const schema = Joi.object({
//         email: Joi.string().email().required()
//     });
//     validateRequest(req, next, schema);
// }

// function forgotPassword(req, res, next) {
//     accountService.forgotPassword(req.body, req.get('origin'))
//         .then(() => res.json({ message: 'Please check your email for password reset instructions' }))
//         .catch(next);
// }

// function validateResetTokenSchema(req, res, next) {
//     const schema = Joi.object({
//         token: Joi.string().required()
//     });
//     validateRequest(req, next, schema);
// }

// function validateResetToken(req, res, next) {
//     accountService.validateResetToken(req.body)
//         .then(() => res.json({ message: 'Token is valid' }))
//         .catch(next);
// }

// function resetPasswordSchema(req, res, next) {
//     const schema = Joi.object({
//         token: Joi.string().required(),
//         password: Joi.string().min(6).required(),
//         confirmPassword: Joi.string().valid(Joi.ref('password')).required()
//     });
//     validateRequest(req, next, schema);
// }

// function resetPassword(req, res, next) {
//     accountService.resetPassword(req.body)
//         .then(() => res.json({ message: 'Password reset successful, you can now login' }))
//         .catch(next);
// }

// function getAll(req, res, next) {
//     accountService.getAll()
//         .then(accounts => res.json(accounts))
//         .catch(next);
// }

// function getById(req, res, next) {
//     // users can get their own account and admins can get any account
//     if (Number(req.params.id) !== req.user.id && req.user.role !== Role.Admin) {
//         return res.status(401).json({ message: 'Unauthorized' });
//     }

//     accountService.getById(req.params.id)
//         .then(account => account ? res.json(account) : res.sendStatus(404))
//         .catch(next);
// }

// function createSchema(req, res, next) {
//     const schema = Joi.object({
//         title: Joi.string().required(),
//         firstName: Joi.string().required(),
//         lastName: Joi.string().required(),
//         email: Joi.string().email().required(),
//         password: Joi.string().min(6).required(),
//         confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
//         role: Joi.string().valid(Role.Admin, Role.User).required()
//     });
//     validateRequest(req, next, schema);
// }

// function create(req, res, next) {
//     accountService.create(req.body)
//         .then(account => res.json(account))
//         .catch(next);
// }

// function updateSchema(req, res, next) {
//     const schemaRules = {
//         title: Joi.string().empty(''),
//         firstName: Joi.string().empty(''),
//         lastName: Joi.string().empty(''),
//         email: Joi.string().email().empty(''),
//         password: Joi.string().min(6).empty(''),
//         confirmPassword: Joi.string().valid(Joi.ref('password')).empty('')
//     };

//     // only admins can update role
//     if (req.user.role === Role.Admin) {
//         schemaRules.role = Joi.string().valid(Role.Admin, Role.User).empty('');
//     }

//     const schema = Joi.object(schemaRules).with('password', 'confirmPassword');
//     validateRequest(req, next, schema);
// }

// function update(req, res, next) {
//     // users can update their own account and admins can update any account
//     if (Number(req.params.id) !== req.user.id && req.user.role !== Role.Admin) {
//         return res.status(401).json({ message: 'Unauthorized' });
//     }

//     accountService.update(req.params.id, req.body)
//         .then(account => res.json(account))
//         .catch(next);
// }

// function _delete(req, res, next) {
//     // users can delete their own account and admins can delete any account
//     if (Number(req.params.id) !== req.user.id && req.user.role !== Role.Admin) {
//         return res.status(401).json({ message: 'Unauthorized' });
//     }

//     accountService.delete(req.params.id)
//         .then(() => res.json({ message: 'Account deleted successfully' }))
//         .catch(next);
// }

// const express = require('express');
// const router = express.Router();
// const validateRequest = require('_middleware/validate-request');
// const authorize = require('_middleware/authorize')
// const Role = require('_helpers/role');
// const accountService = require('./account.service');
const jwt = require("jsonwebtoken");
const validator = require("../middlewares/validator");
const UserService = require("../services/user.service").getInstance();
const authorize = require("../middlewares/authorize.js");

const { secret } = require("../config.json");

module.exports = (router) => {
  //     function authenticateSchema(req, res, next) {
  //         const schema = Joi.object({
  //             email: Joi.string().required(),
  //             password: Joi.string().required()
  //         });
  //         validateRequest(req, next, schema);
  //     }

  //     function authenticate(req, res, next) {
  //         const { email, password } = req.body;
  //         const ipAddress = req.ip;
  //         accountService.authenticate({ email, password, ipAddress })
  //             .then(({ refreshToken, ...account }) => {
  //                 setTokenCookie(res, refreshToken);
  //                 res.json(account);
  //             })
  //             .catch(next);
  //     }

  //     router.post('/authentication',
  // 			validator({
  // 				email: {
  // 					type: 'string'
  // 				},
  // 				password: {
  // 					type: 'string'
  // 				}
  // 			}),

  //     )

  //     const service = new CaculateService()
  //     router.get('/:a/:b',
  //         validator({
  //             a: {
  //                 type: 'number'
  //             },
  //             b: {
  //                 type: 'string'
  //             }
  //         }),
  //         (req, res) => {
  //             const {a, b} = req.params
  //             const result = service.sum({a, b})
  //             res.json(result)
  //         }
  //     )
  router.post(
    "/register",
    validator({
      email: {
        type: "string",
        required: true,
      },
      password: {
        type: "string",
        required: true,
      },
      firstName: {
        type: "string",
        required: true,
      },
      lastName: {
        type: "string",
        required: true,
      },
      phone: {
        type: "string",
        required: true,
      },
      address: {
        type: "string",
        required: false,
      },
      birthdate: {
        type: "string",
        required: false,
      },
    }),
    async (req, res, next) => {
      try {
        const result = await UserService.signup(req.body);
        const userId = result._id;
        const user = await UserService.get(userId);

        let token = jwt.sign(
          { id: result._id },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: 86400, // expires in 24 hours
          }
        );
        res.cookie("jwt", token, { maxAge: 86400 });

        return res.status(200).json({
          message: "Successful",
          token: token,
          type: user.type,
        });
      } catch (error) {
        console.log(error);
        return res.status(404).json({
          message: "Fail",
          error: error.message,
        });
      }
    }
  );

  router.post(
    "/login",
    validator({
      email: {
        type: "string",
        required: true,
      },
      password: {
        type: "string",
        required: true,
      },
    }),
    async (req, res, next) => {
      try {
        const result = await UserService.login(req.body);
        if (!result) {
          return res.status(401).json({
            message: "Fail",
            error: "Incorrect account or password",
          });
        }

        const userId = result._id;
        const user = await UserService.get(userId);

        var token = jwt.sign(
          { id: result._id, type: user.type },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: 86400, // expires in 24 hours
          }
        );

        res.cookie("jwt", token, { maxAge: 86400 });

        return res.status(200).json({
          message: "Successful",
          token: token,
          type: user.type,
        });
      } catch (error) {
        console.log(error);
        return res.status(404).json({
          message: "Fail",
          error: error.message,
        });
      }
    }
  );

  router.get("/me", authorize.verifyAccessToken, async (req, res, next) => {
    try {
      const _id = req.payload.id;
      console.log("helooooooooooooooooooooo", req.payload);
      const user = await UserService.get(_id);
      console.log("this is user", user);
      if (!user) return res.status(404).json("No user found.");
      return res.status(200).json({ user: user });
    } catch (error) {
      console.log(error);
      return res.status(404).json({
        message: "Fail",
        error: error.message,
      });
    }
  });
};
