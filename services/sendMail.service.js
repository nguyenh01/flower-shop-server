const {google} = require('googleapis')
const nodemailer = require("nodemailer");
const BaseService = require('./base.service')
require('dotenv').config()

const CLIENT_ID = process.env.CLIENT_ID 
const CLIENT_SECRET = process.env.CLIENT_SECRET 
const REDIRECT_URI = process.env.REDIRECT_URI 
const REFRESH_TOKEN = process.env.REFRESH_TOKEN

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN})

module.exports = class CategoryService extends BaseService {
  constructor(){
    super()
  }
  send = async ({to, text}) =>{
    try {
        const accessToken = await oAuth2Client.getAccessToken()

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'notifyflowershop@gmail.com', // Email gửi đi
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        })

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Fred Foo 👻" <notifyflowershop@gmail.com>', // sender address
            to: to, // list of receivers
            subject: "Thông báo đặt hàng thành công", // Subject line
            text: text, // plain text body
            // html: "<b>Hello world?456</b>", // html body
        });

        console.log(info);
    } catch (error) {
        console.error(error)
    }
  }
}