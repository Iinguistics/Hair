const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User= require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');



router.post('/', 

 async (req,res) => {
    
  const {  email, password  } = req.body;
  try{
      
      let user = await User.findOne({ email });
      if(!user){
        return  res.status(400).json(
            {message: "Invalid Email"}
        )
      }
     const isMatch = await bcrypt.compare(password, user.password);

     if(!isMatch){
        return  res.status(400).json(
            {message: "Invalid Password"}
        )
     }
      res.json({message: "success"});
     
  } catch(err) {
       console.error(err.message);
       res.status(500).send('Server Error');
  }            
 }
);


router.put('/', async (req, res) => {
 
  const { email, password, newPass  } = req.body;
  try{
      
       let user = await User.findOne({ email });
      if(!user){
        return  res.status(400).json(
            {message: "Invalid Email"}
        )
      }
     const isMatch = await bcrypt.compare(password, user.password);

     if(!isMatch){
        return  res.status(400).json(
            {message: "Invalid Current Password"}
        )
     }
     
     const salt = await bcrypt.genSalt(10);

     user.password = await bcrypt.hash(newPass, salt);

     await user.save();
     res.json({message:'submitted'});
  } catch(err) {
       console.error(err.message);
       res.status(500).send('Server Error');
  } 
});



module.exports = router;