const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User= require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');


//@route  POST api/users
//@desc   Register user
//@access Public
router.post('/', 
[ 
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with at least 6 or more characters').isLength({min: 6})
],
 async (req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }
          const { name, email, password  } = req.body;
          try{
              let user = await User.findOne({ email });
              if(user){
                return  res.status(400).json(
                    {message: "User already exists"}
                )
              }
            
              user = new User({
                  name,
                  email,
                  password
              });
               const salt = await bcrypt.genSalt(10);

               user.password = await bcrypt.hash(password, salt);

               await user.save();
             // why is a token being sent when registering ?
             const payload = {
                 user: {
                     id: user.id
                 }
             }
             jwt.sign(payload, config.get('jwtSecret'),
             { expiresIn: "10h" },
             (err,token) => {
                 if(err) throw err;
                 res.json({token});
              }
             ); 
          } catch(err) {
               console.error(err.message);
               res.status(500).send('Server Error');
          }           
 }
);


router.get('/', async (req, res) => {
    try{
        const users = await User.find();
        res.json(users);
    }
    
        catch (err) {
        console.log(err.message);
        res.status(500).send('server error');
   }
});



router.delete('/:id', async (req, res) => {
    try{
    await User.findByIdAndRemove({_id: req.params.id })
    res.status(200).send();
    res.json({message: "deleted"});
    }   
      catch (err) {
      console.log(err.message);
      res.status(500).send('server error');
    }
  });



module.exports = router;