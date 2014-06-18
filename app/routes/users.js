'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');
// var passport = require('passport');
var multiparty = require('multiparty');


exports.lookup = (req, res, next)=>{
  User.findById(req.session.userId, user=>{
    if(user){
      res.locals.user = user;
    }else{
      res.locals.user = null;
    }
    next();
  });
};

exports.bounce = (req, res, next)=>{
  if(res.locals.user){
    next();
  }else{
    res.redirect('/');
  }
};

exports.createUserLocal = (req, res)=>{
  User.localCreate(req.body, user=>{
    if(user){
      res.redirect('/');
    }
    else{
      res.redirect('/register');
    }
  });
};

exports.verifyLocal = (req, res)=>{
  User.findById(req.params.id, u=>{
    res.render('users/verify', {u:u, title: 'User Verification'});
  });
};

exports.completeLocal = (req, res)=>{
    User.findById(req.params.id, user=>{
      user.makeValid(req.body, u=>{
        if(u){
          res.redirect('/users/edit');
        }
        else{
          res.redirect('/register');
        }
      });
    });
};

exports.loginLocal = (req, res)=>{
  User.login(req.body, user=>{
    if(user){
      req.session.userId = user._id;
      res.redirect('/users/dash');
    } else {
      req.session.userId = null;
      res.redirect('/');
    }
  });
};

exports.logout = (req, res)=>{
  req.session = null;
  res.redirect('/login');
};

exports.dash = (req, res)=>{
  res.render('users/dash', {user: res.locals.user, title: 'Dashboard'});
};

exports.edit = (req, res)=>{
  res.render('users/edit', {user:res.locals.user, title: 'Edit Profile'});
};

exports.update = (req, res)=>{
  var form = new multiparty.Form();
  var user = res.locals.user;

  form.parse(req, (err, fields, files)=>{
    console.log(fields);
    user.update(fields, files);
      user.save(()=>{
        res.redirect('/users/dash');
      });
    });
};

exports.newPassword = (req,res)=>{
  User.findById(res.locals.user._id, user=>{
    user.newPassword(req.body.password, ()=>{
      user.save(()=>{
        res.redirect('/users/dash');
      });
    });
  });
};

exports.destroyUserAccount = (req,res)=>{
  User.destroyById(res.locals.user._id, ()=>{
    if(true){
      res.redirect('/');
    }
  });
};