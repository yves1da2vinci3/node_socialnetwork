const dotenv = require('dotenv');
dotenv.config();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator/check');

const User = require('../models/Users');
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;
  //definition de la strategie de connexion
 

const client = require('twilio')(accountSid, authToken);
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        ' 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'
    }
  })
);
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET_KEY,
  callbackURL: "http://localhost:3000/auth/facebook/callback"
},
function(accessToken, refreshToken, profile, done) {
  const username=   profile.displayname   
  const email=   profile.value  
  const typeuser=   profile.type  
  const profile_image=   profile.photos[1]  
  if(err){console.log(err)}
  done(err)
}
));

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('/auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('/auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
    oldInput:{
      email:"",
      password:"",
      confirmPassword:""
    },
    validationError: []
  });
};

exports.postLogin = (req, res, next) => {
  const email =req.body.email
  const password =req.body.password
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        req.send('Invalid email or password.');
        return res.status(422).redirect('/auth/login');
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          req.flash('error', 'Invalid email or password.');
          res.redirect('/auth/login');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/auth/login');
        });
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const {username,email,country,skills
    ,password,profile_image,
    couverture_image,phone_number,link,typeUser} =req.body;
 

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('/auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      oldInput:{
        email:email,
        password:password,
        confirmPassword:req.body.confirmPassword
      },
      validationError: errors.array()
    });
  }    
       bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            username : username,
            email : email,
            country : country,
            skills : skills || " ",
            password : hashedPassword,
            profile_image : profile_image || " ",
            couverture_image : couverture_image || "",
            resetToken: undefined,
          resetTokenExpiration: undefined,
          phone_number : phone_number,
            link : {...link},
            typeUser : typeUser,
            online : "",
           

             }
          )
          const code_verify = 'abc123';
          client.messages
          .create({from: '+22540117596', body: `Your code is ${code_verify}`, to: `+225${phone_number}`})
          .then(message => console.log(message.sid));
           res.render('/auth/code_verification',{user : user,code : code_verify})
        })
};
exports.getVerification =(req,res,next) => {
  res.render('/auth/code_verification')
}
exports.postVerfication =(req,res,next) => {
  const {code} =req.body;
  if(code === code_verify){
    return user.save().then(
      result =>{
        return transporter.sendMail({
          to: user.email,
          from: 'diomadelacorano.com',
          subject: 'Signup succeeded!',
          html: '<h1>You successfully signed up!</h1>'
        }).then(message =>{
          return res.redirect('/login');
        }).catch(err => console.log(err))
      }
    ).catch( err => console.log(err));
  }

}


exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/auth/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash('error', 'No account with that email found.');
          return res.redirect('/auth/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        res.redirect('/');
        transporter.sendMail({
          to: req.body.email,
          from: 'diomadelacorano@gmail.com',
          subject: 'Password reset',
          html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
          `
        });
      })
      .catch(err => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      let message = req.flash('error');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId
  })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(result => {
      res.redirect('/auth/login');
    })
    .catch(err => {
      console.log(err);
    });
};
exports.getAuthFacebook =(req,res,next) => {

  passport.authenticate('facebook')
}
exports.getCallbackFacebook =(req,res,next) =>{
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/auth/login' });
}