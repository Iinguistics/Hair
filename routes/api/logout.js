const express = require('express');
const router = express.Router();


router.post( '/',
async (req,res) => {
    
      try{
           return  res.send('Logged out');
      } catch(err) {
           res.status(500).send('Server Error');
      }           
    }
);


module.exports = router;