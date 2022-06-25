"use strict";

const createError = require("http-errors");
const bcrypt = require("bcrypt");
const BaseService = require("./base.service");
const User = require("../models/user.model.js");

module.exports = class UserService extends BaseService {
  constructor() {
    super();
  }
  async get(userId) {
    try {
      const user = await User.findById(userId, { password: 0 });

      return user;
    } catch (err) {
      return "There was a problem finding the user.";
    }
  }

  async signup(userInfo) {
    const {
      email,
      password,
      firstName,
      lastName,
      type,
      phone,
      address,
      birthdate,
    } = userInfo;
    const emailExist = email && (await User.findOne({ email: email }));
    if (emailExist) {
      throw createError.Conflict(`${email} is ready been registered`);
    }

    const phoneExist = phone && (await User.findOne({ phone: phone }));
    if (phoneExist) {
      throw createError.Conflict(`${phone} is ready been registered`);
    }

    const userCreated = await User.create({
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      type: 0,
      phone: phone,
      address: address,
      birthdate: birthdate,
    });

    return userCreated;
  }

  async login(userInfo) {
    const { email, password } = userInfo;
    console.log(password);
    const user = await User.findOne({ email: email });
    // const passwordIsValid = await user.isCheckPassword(password);
    // if (!passwordIsValid) return;
    return user;
  }

  // async login (userInfo) {
  //   const {userName, password} = userInfo;
  //   const userNameExist = await User.findOne({userName: userName})
  //   if(userNameExist)
  //   {
  //   		throw createError.Conflict(`${userName} is ready been registered`);
  //   }

  //   const emailExist = await User.findOne({email: email})
  //   if(emailExist)
  //   {
  //   		throw createError.Conflict(`${email} is ready been registered`);
  //   }

  //   const phoneExist = await User.findOne({phone: phone})
  //   if(phoneExist)
  //   {
  //   		throw createError.Conflict(`${phone} is ready been registered`);
  //   }

  //   const userCreated = await User.create({
  //     userName: userName,
  //     password: password,
  //     type: parseInt(type),
  //     email: email,
  //     phone: phone,
  //     address: address,
  //     birthdate: birthdate,
  //   });

  //   return userCreated
  // }
};
