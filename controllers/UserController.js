const User = require("../models/user");
const bcrypt = require('bcrypt');
const Group = require('../models/group');
exports.getSignup = (req,res)=>{
    res.render('signup.ejs');
};

exports.postSignup = async (req,res)=>{
    try {
        const {name,email,password} = req.body;
        const hashpassword = await bcrypt.hash(password,10);

        const newuser = new User({
            name,
            email,
            password:hashpassword,
        });
        await newuser.save();
        res.redirect('/login');
     } catch (error) {
        console.log(error);
        res.status(400).send('Internal Servor error');
    }
};

exports.getLogin = (req,res)=>{
    res.render('login.ejs');
};

exports.postLogin = async(req,res)=>{
 try {
     const email = req.body.email;
     const password = req.body.password;

     const userData = await User.findOne({email:email});
     if(userData){
        const matchpassword =await bcrypt.compare(password,userData.password);
        if(matchpassword){
            req.session.User = userData;
            res.redirect('/dashboard');
        }else{
            res.render('login',{message:'Email and Password is Incorrect'});
        }
     }
     else{
        res.render('login',{message:'Email and Password is Incorrect'});
     }

 } catch (error) {
    console.log(error);
    res.status(400).send('Internal Server Error');
 }
};

exports.Logout = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.redirect('/login');
      }
    });
  };

  exports.getdashboard = async (req,res)=>{
    try {
        const users = await User.find({});
        const groups = await Group.find({});
        console.log(groups);
        res.render('dashboard',{user:req.session.User,users,groups});
    } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
    }
  }