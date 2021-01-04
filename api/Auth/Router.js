const express = require('express')
const Router = express.Router();
const { getLogin, postLogin, getSignup, postSignup, getNewPassword, postNewPassword, getReset, postReset, getAuthFacebook, getCallbackFacebook, getVerification, postVerfication, postLogout } =require('../AuthService');



Router.route('/login').get(getLogin).post(postLogin)
Router.route('/signup').get(getSignup).post(postSignup)
Router.route('/newpassord').get(getNewPassword).post(postNewPassword)
Router.route('/reset').get(getReset).post(postReset)
Router.route('/verification').get(getVerification).post(postVerfication)
Router.route('/facebook').get(getAuthFacebook)
Router.route('/facebook/callback').get(getCallbackFacebook)
Router.route('/logout').post(postLogout)
module.exports = Router;